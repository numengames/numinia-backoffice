import { NextResponse, NextRequest } from 'next/server';

import { connectToDatabase, PlayerSessionModel } from '@/server/lib/db';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '10', 10);
  const skip = (page - 1) * limit;

  try {
    await connectToDatabase();

    const activeSessions = await PlayerSessionModel.aggregate([
      { $match: { startAt: { $exists: true }, endAt: { $exists: false } } },
      {
        $lookup: {
          from: 'players',
          localField: 'playerId',
          foreignField: '_id',
          as: 'playerInfo'
        }
      },
      { $unwind: { path: '$playerInfo', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          playerId: 1,
          startAt: 1,
          endAt: 1,
          spaceName: 1,
          userAgent: 1,
          platform: 1,
          'playerInfo.playerName': 1
        }
      },
      { $skip: skip },
      { $limit: limit }
    ]);

    return NextResponse.json({ activeSessions });
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud', details: (error as Error).message }, { status: 500 });
  }
}
