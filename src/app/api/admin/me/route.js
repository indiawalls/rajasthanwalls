import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/adminAuth';

export async function GET(request) {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) return auth.errorResponse;

    return auth.getResponse(
        NextResponse.json({
            success: true,
            user: {
                id: auth.user.id,
                email: auth.user.email,
                role: auth.user.user_metadata?.role || 'admin',
            },
        })
    );
}
