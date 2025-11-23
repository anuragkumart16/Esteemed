import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, feedback } = body;

        if (!feedback) {
            return NextResponse.json({ error: 'Feedback is required' }, { status: 400 });
        }

        await prisma.feedback.create({
            data: {
                content: feedback,
                userId: userId || null,
            },
        });

        return NextResponse.json({ success: true, message: 'Feedback received' });
    } catch (error) {
        console.error('Error in /api/feedback:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
