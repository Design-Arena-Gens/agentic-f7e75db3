import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const trainings = await prisma.training.findMany({
      orderBy: {
        startDate: 'asc',
      },
    });
    return NextResponse.json(trainings);
  } catch (error) {
    console.error('Trainings API error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const training = await prisma.training.create({
      data: {
        ...body,
        status: 'Open for Registration',
        attendees: '[]',
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
      },
    });
    return NextResponse.json(training, { status: 201 });
  } catch (error) {
    console.error('Create training error:', error);
    return NextResponse.json(
      { error: 'Failed to create training' },
      { status: 500 }
    );
  }
}
