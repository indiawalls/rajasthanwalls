import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json(
        {
            status: 'healthy',
            service: 'rajasthanwall-web',
            timestamp: new Date().toISOString(),
            uptime: Math.floor(process.uptime()),
        },
        { status: 200 }
    );
}
