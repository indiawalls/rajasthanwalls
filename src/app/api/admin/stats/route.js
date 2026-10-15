import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/adminAuth';
import dbConnect from '@/lib/dbConnect';
import Inquiry from '@/models/Inquiry.mjs';
import Project from '@/models/Project.mjs';
import Product from '@/models/Product.mjs';
import Testimonial from '@/models/Testimonial.mjs';
import Faq from '@/models/Faq.mjs';
import BlogPost from '@/models/BlogPost.mjs';

export async function GET(request) {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) return auth.errorResponse;

    try {
        await dbConnect();

        const [
            totalInquiries,
            newInquiries,
            totalProjects,
            totalProducts,
            totalTestimonials,
            totalFaqs,
            totalBlogs,
            recentInquiries
        ] = await Promise.all([
            Inquiry.countDocuments(),
            Inquiry.countDocuments({ status: 'new' }),
            Project.countDocuments(),
            Product.countDocuments(),
            Testimonial.countDocuments(),
            Faq.countDocuments(),
            BlogPost.countDocuments(),
            Inquiry.find().sort({ createdAt: -1 }).limit(5).lean(),
        ]);

        return auth.getResponse(NextResponse.json({
            success: true,
            stats: {
                totalInquiries,
                newInquiries,
                totalProjects,
                totalProducts,
                totalTestimonials,
                totalFaqs,
                totalBlogs,
            },
            recentInquiries,
        }));
    } catch (err) {
        console.error('Failed to get admin stats:', err);
        return NextResponse.json({ error: 'Failed to fetch dashboard metrics.' }, { status: 500 });
    }
}
