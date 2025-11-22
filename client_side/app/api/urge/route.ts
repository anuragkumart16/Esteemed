import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { userId, trigger, victory } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        const urge = await prisma.urge.create({
            data: {
                userId,
                trigger,
                victory,
            },
        });
        return NextResponse.json(urge);
    } catch (error) {
        console.error('Error in /api/urge:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
