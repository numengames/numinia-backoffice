import { NextResponse, NextRequest } from 'next/server';

import { connectToDatabase, PlayerSessionModel } from '@/server/lib/db';

export async function GET(request: NextRequest) {
    await connectToDatabase();

    try {
        const { searchParams } = new URL(request.url);
        const spaceName = searchParams.get('spaceName');
        const days = parseInt(searchParams.get('days') || '0', 10);

        if (!spaceName) {
            return NextResponse.json({ error: 'spaceName is required' }, { status: 400 });
        }

        let dateFilter = {};
        if (days > 0) {
            const now = new Date();
            const pastDate = new Date(now);
            pastDate.setDate(now.getDate() - days);
            dateFilter = { startAt: { $gte: pastDate } };
        }

        const sessions = await PlayerSessionModel.aggregate([
            { $match: { spaceName, startAt: { $exists: true }, endAt: { $exists: true }, ...dateFilter } },
            {
                $project: {
                    duration: { $subtract: ['$endAt', '$startAt'] }
                }
            },
            {
                $group: {
                    _id: null,
                    averageDuration: { $avg: '$duration' }
                }
            }
        ]);

        const averageTime = sessions.length > 0 ? sessions[0].averageDuration / (1000 * 60) : 0;

        console.log(averageTime);

        return NextResponse.json({ averageTime });
    } catch (error) {
        console.error('Error processing the request:', error);
        return NextResponse.json({ error: 'Error processing the request', details: (error as Error).message }, { status: 500 });
    }
}