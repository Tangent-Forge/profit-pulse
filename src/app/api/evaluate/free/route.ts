import { NextRequest, NextResponse } from 'next/server';
import { analyzeFreeIdea } from '@/lib/openai';
import { calculateBasicQPV } from '@/lib/calculations';
import { z } from 'zod';

// Validation schema for free evaluation
const freeEvaluationSchema = z.object({
  ideaName: z.string().min(1, 'Idea name is required').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000),
  quickness: z.number().min(0).max(10),
  profitability: z.number().min(0).max(10),
  validationEase: z.number().min(0).max(10),
});

/**
 * POST /api/evaluate/free
 * Free tier evaluation with AI-powered analysis
 *
 * Cost-optimized using Groq (~$0.00005 per request)
 * Provides actionable feedback without deep strategic insights
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input
    const validation = freeEvaluationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: validation.error.errors.map(e => e.message).join(', ')
        },
        { status: 400 }
      );
    }

    const { ideaName, description, quickness, profitability, validationEase } = validation.data;

    // Calculate QPV score
    const qpvResult = calculateBasicQPV({
      ideaName,
      description,
      quickness,
      profitability,
      validationEase
    });

    // Get AI analysis
    const aiAnalysis = await analyzeFreeIdea(
      ideaName,
      description,
      qpvResult.score
    );

    // Return combined result
    return NextResponse.json({
      qpv: qpvResult,
      ai: aiAnalysis,
      success: true
    });

  } catch (error) {
    console.error('Free evaluation error:', error);

    // Return graceful degradation if AI fails
    return NextResponse.json(
      {
        error: 'Analysis temporarily unavailable',
        message: 'Unable to complete AI analysis. Please try again.'
      },
      { status: 500 }
    );
  }
}
