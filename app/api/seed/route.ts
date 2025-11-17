import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { mockIncidents, mockInspections, mockTrainings, mockPermits, mockChemicals } from '@/lib/mock-data';

export async function POST() {
  try {
    // Clear existing data
    await prisma.incident.deleteMany();
    await prisma.inspection.deleteMany();
    await prisma.training.deleteMany();
    await prisma.permit.deleteMany();
    await prisma.chemical.deleteMany();

    // Seed incidents
    for (const incident of mockIncidents) {
      await prisma.incident.create({
        data: incident,
      });
    }

    // Seed inspections
    for (const inspection of mockInspections) {
      await prisma.inspection.create({
        data: inspection,
      });
    }

    // Seed trainings
    for (const training of mockTrainings) {
      await prisma.training.create({
        data: training,
      });
    }

    // Seed permits
    for (const permit of mockPermits) {
      await prisma.permit.create({
        data: permit,
      });
    }

    // Seed chemicals
    for (const chemical of mockChemicals) {
      await prisma.chemical.create({
        data: chemical,
      });
    }

    return NextResponse.json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}
