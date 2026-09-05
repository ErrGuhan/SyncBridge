/**
 * SyncBridge Cooperative Platform — Time-Series Demand Forecasting Engine (TypeScript)
 * Optimized for Vercel Serverless & Edge Execution
 */

export interface HistoricalBookingInput {
  date: string;
  serviceCategory: string;
  areaCode: string;
  bookingId?: string;
  amount?: number;
}

export interface DemandForecastResult {
  areaCode: string;
  areaName: string;
  zone: string;
  serviceCategory: string;
  predictedDemandNextWeek: number;
  historicalWeeklyAvg: number;
  growthRatePct: number;
  demandLevel: 'CRITICAL_SURGE' | 'HIGH_DEMAND' | 'MODERATE' | 'LOW';
  confidenceScore: number;
  peakDays: string[];
  recommendedWorkerSupply: number;
  currentActiveWorkers: number;
  workerDeficit: number;
  recommendedWorkerAlert: string;
  timeSeriesBreakdown: {
    weeksAnalyzed: number;
    mostRecentWeekCount: number;
    weightedMovingAvg: number;
    trendMultiplier: number;
  };
}

export const AREA_METADATA: Record<string, { name: string; zone: string; baselineCapacity: number }> = {
  '560038': { name: 'Indiranagar', zone: 'East Bengaluru', baselineCapacity: 20 },
  '560034': { name: 'Koramangala', zone: 'South Bengaluru', baselineCapacity: 25 },
  '560102': { name: 'HSR Layout', zone: 'South-East Bengaluru', baselineCapacity: 18 },
  '560076': { name: 'BTM Layout', zone: 'South Bengaluru', baselineCapacity: 22 },
  '560011': { name: 'Jayanagar', zone: 'South Bengaluru', baselineCapacity: 15 },
  '560071': { name: 'Domlur', zone: 'East Bengaluru', baselineCapacity: 12 },
  '560001': { name: 'MG Road / Central', zone: 'Central Bengaluru', baselineCapacity: 30 }
};

function getIsoWeekString(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

export function forecastNextWeekDemand(
  historicalBookings: HistoricalBookingInput[] = [],
  options: {
    smoothingAlpha?: number;
    surgeThreshold?: number;
    criticalThreshold?: number;
    jobsPerWorkerPerWeek?: number;
  } = {}
): DemandForecastResult[] {
  const {
    smoothingAlpha = 0.55,
    surgeThreshold = 1.25,
    criticalThreshold = 1.50,
    jobsPerWorkerPerWeek = 5
  } = options;

  if (!Array.isArray(historicalBookings) || historicalBookings.length === 0) {
    return [];
  }

  const segments = new Map<string, {
    serviceCategory: string;
    areaCode: string;
    weeklyCounts: Map<string, number>;
    dayOfWeekCounts: number[];
    totalBookings: number;
  }>();

  for (const booking of historicalBookings) {
    const { serviceCategory, areaCode, date: dateInput } = booking;
    if (!serviceCategory || !areaCode) continue;

    const date = new Date(dateInput);
    if (isNaN(date.getTime())) continue;

    const weekKey = getIsoWeekString(date);
    const dayOfWeek = date.getDay();
    const segmentKey = `${serviceCategory.trim()}__${String(areaCode).trim()}`;

    if (!segments.has(segmentKey)) {
      segments.set(segmentKey, {
        serviceCategory: serviceCategory.trim(),
        areaCode: String(areaCode).trim(),
        weeklyCounts: new Map(),
        dayOfWeekCounts: new Array(7).fill(0),
        totalBookings: 0
      });
    }

    const seg = segments.get(segmentKey)!;
    seg.totalBookings += 1;
    seg.dayOfWeekCounts[dayOfWeek] += 1;
    seg.weeklyCounts.set(weekKey, (seg.weeklyCounts.get(weekKey) || 0) + 1);
  }

  const forecastResults: DemandForecastResult[] = [];

  for (const [, segData] of segments.entries()) {
    const { serviceCategory, areaCode, weeklyCounts, dayOfWeekCounts, totalBookings } = segData;

    const sortedWeeks = Array.from(weeklyCounts.keys()).sort();
    const weekValues = sortedWeeks.map(w => weeklyCounts.get(w)!);

    if (weekValues.length === 0) continue;

    const sumAllWeeks = weekValues.reduce((acc, val) => acc + val, 0);
    const historicalWeeklyAvg = Number((sumAllWeeks / weekValues.length).toFixed(1));

    let wema = weekValues[0];
    for (let i = 1; i < weekValues.length; i++) {
      wema = (smoothingAlpha * weekValues[i]) + ((1 - smoothingAlpha) * wema);
    }

    let trendFactor = 1.0;
    if (weekValues.length >= 2) {
      const recentWeek = weekValues[weekValues.length - 1];
      const priorWeek = weekValues[weekValues.length - 2];
      const momentumDelta = recentWeek - priorWeek;
      trendFactor = 1.0 + (momentumDelta / Math.max(priorWeek, 1)) * 0.4;
      trendFactor = Math.min(Math.max(trendFactor, 0.70), 1.45);
    }

    const rawForecast = wema * trendFactor;
    const predictedDemandNextWeek = Math.max(1, Math.round(rawForecast));

    const growthRatePct = historicalWeeklyAvg > 0 
      ? Number((((predictedDemandNextWeek - historicalWeeklyAvg) / historicalWeeklyAvg) * 100).toFixed(1))
      : 0;

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const maxDayCount = Math.max(...dayOfWeekCounts);
    const peakDays = dayOfWeekCounts
      .map((count, index) => ({ count, name: dayNames[index] }))
      .filter(item => item.count >= maxDayCount * 0.75 && item.count > 0)
      .map(item => item.name);

    const weekCountScore = Math.min(weekValues.length / 6, 1.0) * 0.5;
    const sampleVolumeScore = Math.min(totalBookings / 50, 1.0) * 0.5;
    const confidenceScore = Number((weekCountScore + sampleVolumeScore).toFixed(2));

    const surgeRatio = predictedDemandNextWeek / Math.max(historicalWeeklyAvg, 1);
    let demandLevel: DemandForecastResult['demandLevel'] = 'MODERATE';
    if (surgeRatio >= criticalThreshold || (growthRatePct >= 40 && predictedDemandNextWeek >= 25)) {
      demandLevel = 'CRITICAL_SURGE';
    } else if (surgeRatio >= surgeThreshold || growthRatePct >= 20) {
      demandLevel = 'HIGH_DEMAND';
    } else if (surgeRatio < 0.8) {
      demandLevel = 'LOW';
    } else {
      demandLevel = 'MODERATE';
    }

    const areaInfo = AREA_METADATA[areaCode] || { 
      name: `Zone ${areaCode}`, 
      zone: 'Metropolitan', 
      baselineCapacity: 15 
    };

    const recommendedWorkerSupply = Math.ceil(predictedDemandNextWeek / jobsPerWorkerPerWeek);
    const currentActiveWorkers = areaInfo.baselineCapacity;
    const workerDeficit = Math.max(0, recommendedWorkerSupply - currentActiveWorkers);

    let alertMessage = '';
    if (demandLevel === 'CRITICAL_SURGE') {
      alertMessage = `🚨 CRITICAL SURGE ALERT: ${serviceCategory} demand in ${areaInfo.name} (${areaCode}) projected at ${predictedDemandNextWeek} jobs (+${growthRatePct}%). Deficit of ${workerDeficit} workers. Immediate cooperative dispatch recommended.`;
    } else if (demandLevel === 'HIGH_DEMAND') {
      alertMessage = `⚡ HIGH DEMAND ALERT: Elevated ${serviceCategory} requests in ${areaInfo.name} (${areaCode}). ${recommendedWorkerSupply} workers needed for expected peak (${peakDays.join(', ')}).`;
    } else {
      alertMessage = `Stable demand for ${serviceCategory} in ${areaInfo.name}. Baseline capacity (${currentActiveWorkers} workers) is sufficient.`;
    }

    forecastResults.push({
      areaCode,
      areaName: areaInfo.name,
      zone: areaInfo.zone,
      serviceCategory,
      predictedDemandNextWeek,
      historicalWeeklyAvg,
      growthRatePct,
      demandLevel,
      confidenceScore,
      peakDays: peakDays.length > 0 ? peakDays : ['Saturday', 'Sunday'],
      recommendedWorkerSupply,
      currentActiveWorkers,
      workerDeficit,
      recommendedWorkerAlert: alertMessage,
      timeSeriesBreakdown: {
        weeksAnalyzed: sortedWeeks.length,
        mostRecentWeekCount: weekValues[weekValues.length - 1],
        weightedMovingAvg: Number(wema.toFixed(1)),
        trendMultiplier: Number(trendFactor.toFixed(2))
      }
    });
  }

  const priorityOrder = { 'CRITICAL_SURGE': 1, 'HIGH_DEMAND': 2, 'MODERATE': 3, 'LOW': 4 };
  forecastResults.sort((a, b) => {
    const priDiff = priorityOrder[a.demandLevel] - priorityOrder[b.demandLevel];
    if (priDiff !== 0) return priDiff;
    return b.workerDeficit - a.workerDeficit || b.growthRatePct - a.growthRatePct;
  });

  return forecastResults;
}

export function generateSampleHistoricalBookings(daysBack = 28): HistoricalBookingInput[] {
  const categories = ['Electrician', 'Plumber', 'Appliance Repair', 'Caregiver & Nursing', 'Deep Cleaning'];
  const areas = ['560038', '560034', '560102', '560076', '560011'];
  
  const sampleData: HistoricalBookingInput[] = [];
  const now = new Date();

  const multipliers: Record<string, number> = {
    'Electrician__560038': 2.4,
    'Appliance Repair__560034': 1.9,
    'Plumber__560102': 1.6,
    'Deep Cleaning__560076': 1.2
  };

  for (let i = daysBack; i >= 0; i--) {
    const bookingDate = new Date(now);
    bookingDate.setDate(now.getDate() - i);
    const dateStr = bookingDate.toISOString().split('T')[0];
    const isWeekend = bookingDate.getDay() === 0 || bookingDate.getDay() === 6;

    for (const cat of categories) {
      for (const area of areas) {
        const key = `${cat}__${area}`;
        let baseCount = Math.floor(Math.random() * 3) + 1;
        
        if (isWeekend) baseCount += 2;
        if (multipliers[key]) {
          const recencyBoost = (daysBack - i) / 7;
          baseCount = Math.round(baseCount * multipliers[key] * (1 + recencyBoost * 0.15));
        }

        for (let k = 0; k < baseCount; k++) {
          sampleData.push({
            bookingId: `BK-HIST-${sampleData.length + 1}`,
            serviceCategory: cat,
            areaCode: area,
            date: dateStr,
            amount: 350 + Math.floor(Math.random() * 400)
          });
        }
      }
    }
  }

  return sampleData;
}
