import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const totalIncidents = await prisma.incident.count({
      where: {
        reportedAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    const openIncidents = await prisma.incident.count({
      where: {
        status: {
          not: 'Resolved',
        },
      },
    });

    const inspectionsDue = await prisma.inspection.count({
      where: {
        status: 'Scheduled',
        dueDate: {
          lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        },
      },
    });

    const totalTrainings = await prisma.training.count();
    const completedTrainings = await prisma.training.count({
      where: { status: 'Completed' },
    });
    const trainingCompliance = totalTrainings > 0
      ? Math.round((completedTrainings / totalTrainings) * 100)
      : 0;

    const pendingPermits = await prisma.permit.count({
      where: {
        status: 'Pending Approval',
      },
    });

    const chemicalInventory = await prisma.chemical.count();

    return NextResponse.json({
      totalIncidents,
      openIncidents,
      inspectionsDue,
      trainingCompliance,
      pendingPermits,
      chemicalInventory,
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      {
        totalIncidents: 0,
        openIncidents: 0,
        inspectionsDue: 0,
        trainingCompliance: 0,
        pendingPermits: 0,
        chemicalInventory: 0,
      },
      { status: 200 }
    );
  }
}
