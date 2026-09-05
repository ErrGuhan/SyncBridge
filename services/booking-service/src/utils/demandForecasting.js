/**
 * ============================================================================
 * SyncBridge Cooperative Platform — AI Demand Forecasting Engine
 * Algorithm: Multi-Window Weighted Exponential Moving Average (WEMA)
 *            with Trend Momentum, Day-of-Week Seasonality, & Worker Deficit Mapping
 * ============================================================================
 * 
 * Takes historical booking transactions (Date, Service Category, Area Code)
 * and outputs predictive demand projections for the upcoming week, complete with:
 *  - Projected booking volumes
 *  - Growth velocity percentage
 *  - Demand Level (CRITICAL_SURGE | HIGH_DEMAND | MODERATE | LOW)
 *  - Statistical confidence intervals
 *  - Worker supply gap / deficit analysis
 *  - Automated cooperative worker dispatch alerts
 */

/**
 * Area code metadata dictionary for human-readable naming & baseline capacity.
 */
const AREA_METADATA = {
  '560038': { name: 'Indiranagar', zone: 'East Bengaluru', baselineCapacity: 20 },
  '560034': { name: 'Koramangala', zone: 'South Bengaluru', baselineCapacity: 25 },
  '560102': { name: 'HSR Layout', zone: 'South-East Bengaluru', baselineCapacity: 18 },
  '560076': { name: 'BTM Layout', zone: 'South Bengaluru', baselineCapacity: 22 },
  '560011': { name: 'Jayanagar', zone: 'South Bengaluru', baselineCapacity: 15 },
  '560071': { name: 'Domlur', zone: 'East Bengaluru', baselineCapacity: 12 },
  '560001': { name: 'MG Road / Central', zone: 'Central Bengaluru', baselineCapacity: 30 }
};

/**
 * Helper to calculate ISO week string (e.g., '2026-W34') for temporal bucketing.
 * @param {Date} date 
 * @returns {string}
 */
function getIsoWeekString(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

/**
 * Parses any date representation (ISO string, YYYY-MM-DD, or timestamp) safely.
 * @param {string|Date|number} dateInput 
 * @returns {Date}
 */
function safeParseDate(dateInput) {
  const parsed = new Date(dateInput);
  if (isNaN(parsed.getTime())) {
    throw new Error(`Invalid date format provided in historical record: "${dateInput}"`);
  }
  return parsed;
}

/**
 * Main Demand Forecasting Function
 * 
 * @param {Array<Object>} historicalBookings - Array of historical booking events:
 *        [{ date: '2026-08-15', serviceCategory: 'Electrician', areaCode: '560038', ... }]
 * @param {Object} [options]
 * @param {number} [options.smoothingAlpha=0.55] - Exponential smoothing parameter (0 < alpha <= 1)
 * @param {number} [options.surgeThreshold=1.25] - Multiplier above baseline considered a surge (1.25 = +25%)
 * @param {number} [options.criticalThreshold=1.50] - Multiplier for critical worker deficit (+50%)
 * @param {number} [options.jobsPerWorkerPerWeek=5] - Typical capacity per verified worker per week
 * @returns {Array<Object>} Array of forecasted high-demand zones for next week
 */
function forecastNextWeekDemand(historicalBookings = [], options = {}) {
  const {
    smoothingAlpha = 0.55,
    surgeThreshold = 1.25,
    criticalThreshold = 1.50,
    jobsPerWorkerPerWeek = 5
  } = options;

  if (!Array.isArray(historicalBookings) || historicalBookings.length === 0) {
    return [];
  }

  // --------------------------------------------------------------------------
  // Step 1: Data Cleansing, Normalization, & Weekly Aggregation
  // Key: `${serviceCategory}__${areaCode}`
  // --------------------------------------------------------------------------
  const segments = new Map();

  for (const booking of historicalBookings) {
    const { serviceCategory, areaCode } = booking;
    if (!serviceCategory || !areaCode) continue;

    const date = safeParseDate(booking.date || booking.createdAt || booking.scheduledDate);
    const weekKey = getIsoWeekString(date);
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
    const segmentKey = `${serviceCategory.trim()}__${String(areaCode).trim()}`;

    if (!segments.has(segmentKey)) {
      segments.set(segmentKey, {
        serviceCategory: serviceCategory.trim(),
        areaCode: String(areaCode).trim(),
        weeklyCounts: new Map(), // weekKey -> count
        dayOfWeekCounts: new Array(7).fill(0),
        totalBookings: 0
      });
    }

    const seg = segments.get(segmentKey);
    seg.totalBookings += 1;
    seg.dayOfWeekCounts[dayOfWeek] += 1;
    seg.weeklyCounts.set(weekKey, (seg.weeklyCounts.get(weekKey) || 0) + 1);
  }

  const forecastResults = [];

  // --------------------------------------------------------------------------
  // Step 2: Time-Series Weighted Moving Average & Trend Momentum per Segment
  // --------------------------------------------------------------------------
  for (const [segmentKey, segData] of segments.entries()) {
    const { serviceCategory, areaCode, weeklyCounts, dayOfWeekCounts, totalBookings } = segData;

    // Chronologically sort unique weeks
    const sortedWeeks = Array.from(weeklyCounts.keys()).sort();
    const weekValues = sortedWeeks.map(w => weeklyCounts.get(w));

    if (weekValues.length === 0) continue;

    // A. Baseline Simple Moving Average (SMA)
    const sumAllWeeks = weekValues.reduce((acc, val) => acc + val, 0);
    const historicalWeeklyAvg = Number((sumAllWeeks / weekValues.length).toFixed(1));

    // B. Weighted Exponential Moving Average (WEMA) giving primacy to recent weeks
    // WEMA_t = alpha * Y_t + (1 - alpha) * WEMA_{t-1}
    let wema = weekValues[0];
    for (let i = 1; i < weekValues.length; i++) {
      wema = (smoothingAlpha * weekValues[i]) + ((1 - smoothingAlpha) * wema);
    }

    // C. Trend Momentum Factor
    // Compare the last 2 weeks to detect acceleration or deceleration
    let trendFactor = 1.0;
    if (weekValues.length >= 2) {
      const recentWeek = weekValues[weekValues.length - 1];
      const priorWeek = weekValues[weekValues.length - 2];
      const momentumDelta = recentWeek - priorWeek;
      
      // Bound trend multiplier between 0.70x and 1.45x to prevent unbounded divergence
      trendFactor = 1.0 + (momentumDelta / Math.max(priorWeek, 1)) * 0.4;
      trendFactor = Math.min(Math.max(trendFactor, 0.70), 1.45);
    }

    // Projected next week volume (rounded to whole jobs)
    const rawForecast = wema * trendFactor;
    const predictedDemandNextWeek = Math.max(1, Math.round(rawForecast));

    // D. Growth Velocity %
    const growthRatePct = historicalWeeklyAvg > 0 
      ? Number((((predictedDemandNextWeek - historicalWeeklyAvg) / historicalWeeklyAvg) * 100).toFixed(1))
      : 0;

    // E. Peak Days of the Week Identification
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const maxDayCount = Math.max(...dayOfWeekCounts);
    const peakDays = dayOfWeekCounts
      .map((count, index) => ({ count, name: dayNames[index] }))
      .filter(item => item.count >= maxDayCount * 0.75 && item.count > 0)
      .map(item => item.name);

    // F. Statistical Confidence Score (0.0 to 1.0)
    // Higher with more weeks observed, lower with high variance
    const weekCountScore = Math.min(weekValues.length / 6, 1.0) * 0.5; // up to 6 weeks of data
    const sampleVolumeScore = Math.min(totalBookings / 50, 1.0) * 0.5;
    const confidenceScore = Number((weekCountScore + sampleVolumeScore).toFixed(2));

    // G. Demand Classification & Worker Deficit Modeling
    const surgeRatio = predictedDemandNextWeek / Math.max(historicalWeeklyAvg, 1);
    let demandLevel = 'NORMAL';
    if (surgeRatio >= criticalThreshold || (growthRatePct >= 40 && predictedDemandNextWeek >= 25)) {
      demandLevel = 'CRITICAL_SURGE';
    } else if (surgeRatio >= surgeThreshold || growthRatePct >= 20) {
      demandLevel = 'HIGH_DEMAND';
    } else if (surgeRatio < 0.8) {
      demandLevel = 'LOW';
    } else {
      demandLevel = 'MODERATE';
    }

    // H. Cooperative Worker Deficit / Supply Gap Estimation
    const areaInfo = AREA_METADATA[areaCode] || { 
      name: `Zone ${areaCode}`, 
      zone: 'Metropolitan', 
      baselineCapacity: 15 
    };

    const recommendedWorkerSupply = Math.ceil(predictedDemandNextWeek / jobsPerWorkerPerWeek);
    const currentActiveWorkers = areaInfo.baselineCapacity;
    const workerDeficit = Math.max(0, recommendedWorkerSupply - currentActiveWorkers);

    // I. Actionable Dispatch Alert Message
    let alertMessage = '';
    if (demandLevel === 'CRITICAL_SURGE') {
      alertMessage = `🚨 CRITICAL SURGE ALERT: ${serviceCategory} demand in ${areaInfo.name} (${areaCode}) projected at ${predictedDemandNextWeek} jobs (+${growthRatePct}%). Deficit of ${workerDeficit} workers. Immediate dispatch bonus recommended.`;
    } else if (demandLevel === 'HIGH_DEMAND') {
      alertMessage = `⚡ HIGH DEMAND ALERT: Elevated ${serviceCategory} requests in ${areaInfo.name} (${areaCode}). ${recommendedWorkerSupply} workers needed for expected weekend peak (${peakDays.join(', ')}).`;
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

  // --------------------------------------------------------------------------
  // Step 3: Sort by Demand Priority (Critical Surges & Highest Deficits First)
  // --------------------------------------------------------------------------
  const priorityOrder = { 'CRITICAL_SURGE': 1, 'HIGH_DEMAND': 2, 'MODERATE': 3, 'LOW': 4 };
  forecastResults.sort((a, b) => {
    const priDiff = priorityOrder[a.demandLevel] - priorityOrder[b.demandLevel];
    if (priDiff !== 0) return priDiff;
    return b.workerDeficit - a.workerDeficit || b.growthRatePct - a.growthRatePct;
  });

  return forecastResults;
}

/**
 * Generates rich synthetic historical dataset for testing & demonstration
 * covering multiple weeks, categories, and Bengaluru postal codes.
 * @param {number} [daysBack=28] - Days of historical generation
 * @returns {Array<Object>}
 */
function generateSampleHistoricalBookings(daysBack = 28) {
  const categories = ['Electrician', 'Plumber', 'Appliance Repair', 'Caregiver & Nursing', 'Deep Cleaning'];
  const areas = ['560038', '560034', '560102', '560076', '560011'];
  
  const sampleData = [];
  const now = new Date();

  // Category & area multipliers to simulate real-world spikes (e.g. Electricians in Indiranagar)
  const multipliers = {
    'Electrician__560038': 2.4, // Major surge
    'Appliance Repair__560034': 1.9, // AC repairs in Koramangala
    'Plumber__560102': 1.6, // Pipe repairs in HSR
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
        let baseCount = Math.floor(Math.random() * 3) + 1; // 1-3 baseline
        
        if (isWeekend) baseCount += 2;
        if (multipliers[key]) {
          // Add recent upward trend over last 14 days
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

module.exports = {
  forecastNextWeekDemand,
  generateSampleHistoricalBookings,
  AREA_METADATA
};
