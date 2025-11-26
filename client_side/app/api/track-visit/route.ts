import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { visitorId, userAgent } = await req.json();

        if (!visitorId) {
            return NextResponse.json({ error: 'Missing visitorId' }, { status: 400 });
        }

        // Get IP and Location from headers
        const ip = req.headers.get('x-forwarded-for') || 'unknown';
        const country = req.headers.get('x-vercel-ip-country') || 'unknown';
        const city = req.headers.get('x-vercel-ip-city') || 'unknown';

        // Also try to get user agent from headers if not provided in body
        const finalUserAgent = userAgent || req.headers.get('user-agent') || 'unknown';

        const visit = await prisma.userVisit.create({
            data: {
                visitorId,
                ip,
                country,
                city,
                userAgent: finalUserAgent,
            },
        });

        return NextResponse.json({ success: true, data: visit }, { status: 201 });
    } catch (error) {
        console.error('Error tracking visit:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
