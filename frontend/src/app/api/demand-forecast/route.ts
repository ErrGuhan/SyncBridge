import { NextResponse } from 'next/server';
import { forecastNextWeekDemand, generateSampleHistoricalBookings, HistoricalBookingInput } from '@/lib/demandForecasting';
import { supabaseServer } from '@/lib/supabaseServer';
import { GoogleGenAI } from '@google/genai';

interface CachedForecastData {
  payload: any;
  timestamp: number;
}

const FORECAST_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
let forecastCache: CachedForecastData | null = null;

export async function GET() {
  const now = Date.now();

  // Return cached forecast if fresh
  if (forecastCache && now - forecastCache.timestamp < FORECAST_CACHE_TTL_MS) {
    return NextResponse.json(forecastCache.payload, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'X-Cache': 'HIT'
      }
    });
  }

  try {
    let historicalData: HistoricalBookingInput[] = [];
    let isLiveDb = false;

    // 1. Try querying real historical bookings from Supabase
    try {
      const { data: dbBookings, error } = await supabaseServer
        .from('Booking')
        .select(`
          scheduledDate,
          servicePostalCode,
          totalAmount,
          serviceCategory:ServiceCategory(slug)
        `)
        .limit(200);

      if (!error && dbBookings && dbBookings.length >= 10) {
        historicalData = dbBookings.map(b => ({
          date: b.scheduledDate,
          serviceCategory: (b.serviceCategory as any)?.slug || 'electrical',
          areaCode: b.servicePostalCode || '560038',
          amount: Number(b.totalAmount) || 500
        }));
        isLiveDb = true;
      }
    } catch (dbErr) {
      console.warn('[demand-forecast API] Supabase query notice:', dbErr);
    }

    // Fallback/Supplement to 28-day sample if database has insufficient history
    if (historicalData.length < 10) {
      historicalData = generateSampleHistoricalBookings(28);
    }

    const forecast = forecastNextWeekDemand(historicalData);

    // 2. Gemini AI Summary for Top Critical Surge Alerts
    let aiNarrative: string | null = null;
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const topSurges = forecast
          .filter(f => f.demandLevel === 'CRITICAL_SURGE' || f.demandLevel === 'HIGH_DEMAND')
          .slice(0, 3);

        if (topSurges.length > 0) {
          const ai = new GoogleGenAI({ apiKey });
          const prompt = `You are the AI operations advisor for SyncBridge, a federation of primary worker cooperatives in Bengaluru.
Summarize these predicted demand spikes in 2 concise sentences for cooperative administrators. Focus on artisan supply actions needed.
Data:
${JSON.stringify(topSurges.map(s => ({
  trade: s.serviceCategory,
  area: s.areaName,
  predictedDemand: s.predictedDemandNextWeek,
  deficit: s.workerDeficit
})))}`;

          const res = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ text: prompt }]
          });

          aiNarrative = res.text?.trim() || null;
        }
      } catch (geminiErr) {
        console.warn('[demand-forecast API] Gemini summary warning:', geminiErr);
      }
    }

    const responsePayload = {
      success: true,
      data: forecast,
      aiNarrative,
      metadata: {
        source: isLiveDb ? 'SUPABASE_DB' : 'SYNTHESIZED_HISTORICAL_28D',
        totalHistoricalSamples: historicalData.length,
        algorithm: 'Multi-Window Weighted Exponential Moving Average (WEMA) + Momentum Trend',
        generatedAt: new Date().toISOString(),
        isAiEnhanced: !!aiNarrative,
        runtime: 'Vercel Serverless / Edge Function'
      }
    };

    // Store in memory cache
    forecastCache = {
      payload: responsePayload,
      timestamp: now
    };

    return NextResponse.json(responsePayload, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'X-Cache': 'MISS'
      }
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Forecasting failed' },
      { status: 500 }
    );
  }
}
