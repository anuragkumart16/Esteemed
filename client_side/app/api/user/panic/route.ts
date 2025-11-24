import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                panicButtonClicks: { increment: 1 },
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error in /api/user/panic:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
