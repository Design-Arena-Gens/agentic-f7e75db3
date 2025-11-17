import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const chemicals = await prisma.chemical.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    return NextResponse.json(chemicals);
  } catch (error) {
    console.error('Chemicals API error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const chemical = await prisma.chemical.create({
      data: {
        ...body,
        expiryDate: body.expiryDate ? new Date(body.expiryDate) : null,
        lastInspected: new Date(),
      },
    });
    return NextResponse.json(chemical, { status: 201 });
  } catch (error) {
    console.error('Create chemical error:', error);
    return NextResponse.json(
      { error: 'Failed to create chemical' },
      { status: 500 }
    );
  }
}
