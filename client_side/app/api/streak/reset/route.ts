import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { userId, reason } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        // Log relapse
        await prisma.relapse.create({
            data: {
                userId,
                reason,
            },
        });

        // Reset streak
        const user = await prisma.user.update({
            where: { id: userId },
            data: { streakStartDate: null },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error in /api/streak/reset:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
