import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { userId, email } = await req.json();

        if (!userId || !email) {
            return NextResponse.json({ error: 'Missing userId or email' }, { status: 400 });
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
        }


        const earlyAccessEntry = await prisma.earlyAccess.create({
            data: {
                userId,
                email,
            },
        });

        return NextResponse.json({ success: true, data: earlyAccessEntry }, { status: 201 });
    } catch (error) {
        console.error('Error submitting early access:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
