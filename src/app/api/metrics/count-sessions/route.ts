import { NextResponse } from 'next/server';

import { connectToDatabase, PlayerSessionModel } from '@/server/lib/db';

export async function GET() {
  await connectToDatabase();

  try {
    const sessionCount = await PlayerSessionModel.countDocuments({
      startAt: { $exists: true },
      endAt: { $exists: false },
    });

    return NextResponse.json({ sessionCount });
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud', details: (error as Error).message }, { status: 500 });
  }
}