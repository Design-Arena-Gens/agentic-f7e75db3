import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const inspections = await prisma.inspection.findMany({
      orderBy: {
        dueDate: 'asc',
      },
    });
    return NextResponse.json(inspections);
  } catch (error) {
    console.error('Inspections API error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const inspection = await prisma.inspection.create({
      data: {
        ...body,
        status: 'Scheduled',
        dueDate: new Date(body.dueDate),
      },
    });
    return NextResponse.json(inspection, { status: 201 });
  } catch (error) {
    console.error('Create inspection error:', error);
    return NextResponse.json(
      { error: 'Failed to create inspection' },
      { status: 500 }
    );
  }
}
