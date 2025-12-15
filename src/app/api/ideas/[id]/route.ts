import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { updateIdeaSchema, validateRequest, formatValidationError } from '@/lib/validations';

// GET /api/ideas/[id] - Get a specific idea
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const idea = await prisma.idea.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!idea) {
      return NextResponse.json(
        { error: 'Idea not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ idea });
  } catch (error) {
    console.error('Error fetching idea:', error);
    return NextResponse.json(
      { error: 'Failed to fetch idea' },
      { status: 500 }
    );
  }
}

// PUT /api/ideas/[id] - Update an idea
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();

    // Validate request body
    const validation = validateRequest(updateIdeaSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: formatValidationError(validation.error)
        },
        { status: 400 }
      );
    }

    const { title, description, qpvScore, evaluation, blueprint } = validation.data;

    const idea = await prisma.idea.updateMany({
      where: {
        id,
        userId: session.user.id,
      },
      data: {
        title,
        description,
        qpvScore,
        evaluation,
        blueprint,
      },
    });

    if (idea.count === 0) {
      return NextResponse.json(
        { error: 'Idea not found' },
        { status: 404 }
      );
    }

    const updatedIdea = await prisma.idea.findUnique({ where: { id } });
    return NextResponse.json({ idea: updatedIdea });
  } catch (error) {
    console.error('Error updating idea:', error);
    return NextResponse.json(
      { error: 'Failed to update idea' },
      { status: 500 }
    );
  }
}

// DELETE /api/ideas/[id] - Delete an idea
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const idea = await prisma.idea.deleteMany({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (idea.count === 0) {
      return NextResponse.json(
        { error: 'Idea not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting idea:', error);
    return NextResponse.json(
      { error: 'Failed to delete idea' },
      { status: 500 }
    );
  }
}
