import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const incidents = await prisma.incident.findMany({
      orderBy: {
        reportedAt: 'desc',
      },
    });
    return NextResponse.json(incidents);
  } catch (error) {
    console.error('Incidents API error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const incident = await prisma.incident.create({
      data: {
        ...body,
        status: 'Open',
      },
    });
    return NextResponse.json(incident, { status: 201 });
  } catch (error) {
    console.error('Create incident error:', error);
    return NextResponse.json(
      { error: 'Failed to create incident' },
      { status: 500 }
    );
  }
}
