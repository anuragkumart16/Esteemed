import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { userId, startDate } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: { streakStartDate: new Date(startDate) },
        });
        return NextResponse.json(user);
    } catch (error) {
        console.error('Error in /api/streak/start:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
