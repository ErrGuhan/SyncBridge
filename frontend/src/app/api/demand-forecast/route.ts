import { NextResponse } from 'next/server';
import { forecastNextWeekDemand, generateSampleHistoricalBookings } from '@/lib/demandForecasting';

export async function GET() {
  try {
    const historicalData = generateSampleHistoricalBookings(28);
    const forecast = forecastNextWeekDemand(historicalData);

    return NextResponse.json({
      success: true,
      data: forecast,
      metadata: {
        totalHistoricalSamples: historicalData.length,
        algorithm: 'Multi-Window Weighted Exponential Moving Average (WEMA) + Momentum Trend',
        generatedAt: new Date().toISOString(),
        runtime: 'Vercel Serverless / Edge Function'
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Forecasting failed' },
      { status: 500 }
    );
  }
}
