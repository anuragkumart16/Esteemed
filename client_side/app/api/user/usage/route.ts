import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const now = new Date();
        const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;

        let updatedUser = user;

        // Check if it's a new day (simple check: different date string)
        const isNewDay = !lastActive || now.toDateString() !== lastActive.toDateString();

        if (isNewDay) {
            updatedUser = await prisma.user.update({
                where: { id: userId },
                data: {
                    daysOnPlatform: { increment: 1 },
                    lastActiveDate: now,
                },
            });
        }

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('Error in /api/user/usage:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
