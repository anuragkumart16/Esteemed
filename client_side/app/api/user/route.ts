import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => ({}));
        const { userId } = body;

        if (userId) {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                include: { urges: true, relapses: true },
            });
            if (user) return NextResponse.json(user);
        }

        const newUser = await prisma.user.create({
            data: {},
        });
        return NextResponse.json(newUser);
    } catch (error) {
        console.error('Error in /api/user:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
