import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

interface DiagnosticResult {
  tradeCategory: string;
  urgencyLevel: 'EMERGENCY' | 'HIGH' | 'STANDARD';
  fairPriceRange: { min: number; max: number };
  estimatedHours: number;
  suggestedTools: string[];
  diagnosisSummary: string;
  safetyCaution?: string;
  isAiGenerated: boolean;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { problemDescription, imageBase64, mimeType } = body;

    if (!problemDescription && !imageBase64) {
      return NextResponse.json(
        { error: 'Please provide either a problem description or an image.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Strategy 1: Real Multimodal Gemini 3.7 Flash inference if API key is configured
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        
        const prompt = `You are a certified master technical advisor for a democratic worker cooperative services platform in India.
Analyze this household or commercial maintenance issue and output a valid JSON object ONLY (no markdown formatting, no code fences):
{
  "tradeCategory": "Plumbing" | "Electrical" | "Cleaning" | "Appliance Repair" | "Carpentry",
  "urgencyLevel": "EMERGENCY" | "HIGH" | "STANDARD",
  "fairPriceRange": { "min": number, "max": number },
  "estimatedHours": number,
  "suggestedTools": ["tool1", "tool2", "tool3"],
  "diagnosisSummary": "A concise 2-sentence explanation of what is likely wrong and what the artisan must inspect",
  "safetyCaution": "Important safety warning for the resident if applicable (or null)"
}

Problem description: ${problemDescription || 'See attached image'}
Currency: Indian Rupees (INR ₹) based on fair 90% direct cooperative worker compensation rates.`;

        const contents: any[] = [{ text: prompt }];

        if (imageBase64 && mimeType) {
          contents.push({
            inlineData: {
              data: imageBase64.replace(/^data:[^;]+;base64,/, ''),
              mimeType: mimeType
            }
          });
        }

        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: contents
        });

        const rawText = response.text || '';
        const cleanJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);

        return NextResponse.json({
          ...parsed,
          isAiGenerated: true
        });
      } catch (geminiErr: any) {
        console.warn('[Gemini API Warning, falling back to heuristic engine]:', geminiErr.message);
      }
    }

    // Strategy 2: Intelligent Heuristic Fallback Engine
    const lower = (problemDescription || '').toLowerCase();
    let result: DiagnosticResult;

    if (lower.includes('water') || lower.includes('leak') || lower.includes('pipe') || lower.includes('drain') || lower.includes('tap') || lower.includes('flush')) {
      result = {
        tradeCategory: 'Plumbing',
        urgencyLevel: lower.includes('burst') || lower.includes('flooding') ? 'EMERGENCY' : 'HIGH',
        fairPriceRange: { min: 350, max: 800 },
        estimatedHours: 1.5,
        suggestedTools: ['Pipe Wrench (12")', 'Teflon Tape', 'Thread Sealant', 'Washers & Gaskets'],
        diagnosisSummary: 'Identified pipe joint or valve sealing failure causing fluid leakage. Requires valve isolation and gasket/threaded coupler replacement.',
        safetyCaution: 'Shut off the main ball valve immediately to prevent water damage to adjacent electrical conduits.',
        isAiGenerated: false
      };
    } else if (lower.includes('spark') || lower.includes('fuse') || lower.includes('switch') || lower.includes('wire') || lower.includes('shock') || lower.includes('power') || lower.includes('mcb')) {
      result = {
        tradeCategory: 'Electrical',
        urgencyLevel: lower.includes('spark') || lower.includes('shock') ? 'EMERGENCY' : 'HIGH',
        fairPriceRange: { min: 400, max: 950 },
        estimatedHours: 1.5,
        suggestedTools: ['Digital Multimeter', 'Insulated Screw Drivers (1000V)', 'Cable Strippers', 'Neoprene Gloves'],
        diagnosisSummary: 'Suspected phase neutral short circuit or tripped MCB overload breaker. Needs insulation resistance check and terminal tightening.',
        safetyCaution: 'Do not touch wet switchboard surfaces with bare hands. Turn off main distribution breaker immediately.',
        isAiGenerated: false
      };
    } else if (lower.includes('wood') || lower.includes('door') || lower.includes('hinge') || lower.includes('lock') || lower.includes('furniture') || lower.includes('cupboard')) {
      result = {
        tradeCategory: 'Carpentry',
        urgencyLevel: lower.includes('lock') ? 'HIGH' : 'STANDARD',
        fairPriceRange: { min: 450, max: 1200 },
        estimatedHours: 2.0,
        suggestedTools: ['Wood Chisel Set', 'Cordless Hammer Drill', 'Concealed Hinge Jigs', 'Precision Level'],
        diagnosisSummary: 'Misaligned hinges or structural timber swelling due to seasonal humidity. Requires alignment adjustment, re-drilling and planar trimming.',
        safetyCaution: 'Ensure heavy cupboard doors are supported before removing hinge pins to avoid pinch injuries.',
        isAiGenerated: false
      };
    } else if (lower.includes('fridge') || lower.includes('washing') || lower.includes('ac') || lower.includes('cool') || lower.includes('motor') || lower.includes('microwave')) {
      result = {
        tradeCategory: 'Appliance Repair',
        urgencyLevel: 'HIGH',
        fairPriceRange: { min: 500, max: 1500 },
        estimatedHours: 2.0,
        suggestedTools: ['Manifold Gauge', 'Capacitor Tester', 'Clamp Meter', 'Nut Driver Set'],
        diagnosisSummary: 'Compressor thermal overload or starting capacitor degradation. Requires electronic board check and refrigerant pressure test.',
        safetyCaution: 'High voltage stored in motor start capacitors even after power unplug. Certified technician inspection required.',
        isAiGenerated: false
      };
    } else {
      result = {
        tradeCategory: 'Cleaning',
        urgencyLevel: 'STANDARD',
        fairPriceRange: { min: 400, max: 900 },
        estimatedHours: 2.5,
        suggestedTools: ['Industrial HEPA Vacuum', 'Microfiber Polishers', 'Bio-degradable Neutral Detergents'],
        diagnosisSummary: 'General residential sanitation and deep surface restoration requirement.',
        safetyCaution: 'Ventilate enclosed areas while specialized disinfectants are in application.',
        isAiGenerated: false
      };
    }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to process AI diagnosis' },
      { status: 500 }
    );
  }
}
