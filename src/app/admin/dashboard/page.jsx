'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Inbox,
    FolderKanban,
    MessageSquareQuote,
    HelpCircle,
    FileText,
    ArrowUpRight,
    Clock,
    Phone,
    Plus,
    Loader2,
} from 'lucide-react';

export default function DashboardOverviewPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/stats')
            .then((r) => r.json())
            .then((res) => {
                if (res.success) setData(res);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
            </div>
        );
    }

    const stats = data?.stats || {};
    const recent = data?.recentInquiries || [];

    const kpiCards = [
        {
            label: 'Total Leads',
            value: stats.totalInquiries ?? 0,
            sub: `${stats.newInquiries ?? 0} new unread`,
            icon: Inbox,
            href: '/admin/dashboard/inquiries',
            color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        },
        {
            label: 'Live Projects',
            value: stats.totalProjects ?? 0,
            sub: 'In portfolio',
            icon: FolderKanban,
            href: '/admin/dashboard/projects',
            color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
        },
        {
            label: 'Client Reviews',
            value: stats.totalTestimonials ?? 0,
            sub: 'Published testimonials',
            icon: MessageSquareQuote,
            href: '/admin/dashboard/testimonials',
            color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        },
        {
            label: 'Active FAQs',
            value: stats.totalFaqs ?? 0,
            sub: 'Customer questions',
            icon: HelpCircle,
            href: '/admin/dashboard/faqs',
            color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
        },
        {
            label: 'Blog Articles',
            value: stats.totalBlogs ?? 0,
            sub: 'Technical insights',
            icon: FileText,
            href: '/admin/dashboard/blogs',
            color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
        },
    ];

    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Greeting & Header */}
            <div className="flex items-center justify-between gap-3">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Admin Overview</h1>

                <Link
                    href="/admin/form-panel"
                    className="inline-flex items-center gap-1.5 text-xs font-bold bg-yellow-400 hover:bg-yellow-300 text-slate-950 px-3.5 py-2 rounded-xl transition shadow-lg shadow-yellow-400/10 cursor-pointer shrink-0"
                >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Project</span>
                </Link>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                {kpiCards.map((kpi) => {
                    const Icon = kpi.icon;
                    return (
                        <Link
                            key={kpi.label}
                            href={kpi.href}
                            className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 hover:border-slate-700 transition group flex flex-col justify-between last:col-span-2 lg:last:col-span-1"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-slate-400">{kpi.label}</span>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${kpi.color}`}>
                                    <Icon className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="text-2xl font-extrabold text-white tracking-tight">
                                    {kpi.value}
                                </div>
                                <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                                    <span>{kpi.sub}</span>
                                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-slate-500" />
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Recent Leads Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-base font-bold text-white">Recent Customer Inquiries</h2>
                    <Link
                        href="/admin/dashboard/inquiries"
                        className="text-xs text-yellow-400 hover:text-yellow-300 transition font-medium"
                    >
                        View All Leads →
                    </Link>
                </div>

                {recent.length === 0 ? (
                    <div className="text-center py-10 text-slate-500 text-xs">
                        No inquiries received yet. Incoming submissions will appear here automatically.
                    </div>
                ) : (
                    <>
                        {/* Mobile Cards View (< sm) */}
                        <div className="sm:hidden space-y-3">
                            {recent.map((lead) => (
                                <div key={lead._id} className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-sm text-slate-200">{lead.name}</span>
                                        <span
                                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                lead.status === 'new'
                                                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                    : lead.status === 'contacted'
                                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                    : 'bg-slate-800 text-slate-400'
                                            }`}
                                        >
                                            {lead.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-slate-400">
                                        <span>{lead.product || 'General'}</span>
                                        <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                                        <span className="text-slate-500">{lead.location || 'Location not specified'}</span>
                                        <a
                                            href={`tel:${lead.phone}`}
                                            className="text-yellow-400 hover:text-yellow-300 transition inline-flex items-center gap-1 font-mono font-semibold"
                                        >
                                            <Phone className="w-3 h-3" />
                                            {lead.phone}
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Table View (>= sm) */}
                        <div className="hidden sm:block overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                                        <th className="pb-3 font-semibold">Client Name</th>
                                        <th className="pb-3 font-semibold">Phone</th>
                                        <th className="pb-3 font-semibold">Product</th>
                                        <th className="pb-3 font-semibold">Location</th>
                                        <th className="pb-3 font-semibold">Status</th>
                                        <th className="pb-3 font-semibold">Received</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60">
                                    {recent.map((lead) => (
                                        <tr key={lead._id} className="hover:bg-slate-800/30 transition">
                                            <td className="py-3.5 font-bold text-slate-200">{lead.name}</td>
                                            <td className="py-3.5">
                                                <a
                                                    href={`tel:${lead.phone}`}
                                                    className="text-slate-300 hover:text-yellow-400 transition inline-flex items-center gap-1 font-mono"
                                                >
                                                    <Phone className="w-3 h-3" />
                                                    {lead.phone}
                                                </a>
                                            </td>
                                            <td className="py-3.5 text-slate-400">{lead.product || 'General'}</td>
                                            <td className="py-3.5 text-slate-400">{lead.location || '—'}</td>
                                            <td className="py-3.5">
                                                <span
                                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                        lead.status === 'new'
                                                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                            : lead.status === 'contacted'
                                                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                            : 'bg-slate-800 text-slate-400'
                                                    }`}
                                                >
                                                    {lead.status}
                                                </span>
                                            </td>
                                            <td className="py-3.5 text-slate-500 font-mono">
                                                {new Date(lead.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
