import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const permits = await prisma.permit.findMany({
      orderBy: {
        startDate: 'desc',
      },
    });
    return NextResponse.json(permits);
  } catch (error) {
    console.error('Permits API error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const permit = await prisma.permit.create({
      data: {
        ...body,
        status: 'Pending Approval',
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
      },
    });
    return NextResponse.json(permit, { status: 201 });
  } catch (error) {
    console.error('Create permit error:', error);
    return NextResponse.json(
      { error: 'Failed to create permit' },
      { status: 500 }
    );
  }
}
