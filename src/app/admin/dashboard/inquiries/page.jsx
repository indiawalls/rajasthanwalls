'use client';

import { useState, useEffect } from 'react';
import {
    Inbox,
    Phone,
    MessageCircle,
    Trash2,
    Loader2,
    Calendar,
    MapPin,
    Ruler,
    FileText,
} from 'lucide-react';

export default function InquiriesAdminPage() {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    function loadInquiries() {
        setLoading(true);
        fetch('/api/admin/inquiries')
            .then((r) => r.json())
            .then((res) => {
                if (res.success) setInquiries(res.inquiries);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }

    useEffect(() => {
        loadInquiries();
    }, []);

    async function handleStatusChange(id, status) {
        try {
            const res = await fetch('/api/admin/inquiries', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status }),
            });
            const data = await res.json();
            if (data.success) {
                setInquiries((prev) =>
                    prev.map((inq) => (inq._id === id ? { ...inq, status } : inq))
                );
            }
        } catch (err) {
            console.error('Failed to update status:', err);
        }
    }

    async function handleDelete(id) {
        if (!confirm('Are you sure you want to delete this customer inquiry?')) return;
        try {
            const res = await fetch(`/api/admin/inquiries?id=${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                setInquiries((prev) => prev.filter((inq) => inq._id !== id));
            }
        } catch (err) {
            console.error('Failed to delete inquiry:', err);
        }
    }

    const filtered = inquiries.filter((inq) => {
        if (filter === 'all') return true;
        return inq.status === filter;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                    <Inbox className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 shrink-0" />
                    <span>Customer Leads</span>
                </h1>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs overflow-x-auto max-w-full">
                    {['all', 'new', 'in-review', 'contacted', 'closed'].map((f) => (
                        <button
                            key={f}
                            type="button"
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-lg capitalize font-medium transition cursor-pointer whitespace-nowrap shrink-0 ${
                                filter === f
                                    ? 'bg-yellow-400 text-slate-950 font-bold'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            {f === 'all' ? `All (${inquiries.length})` : f}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
                    No inquiries found in this category.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filtered.map((inq) => {
                        const cleanPhone = inq.phone.replace(/\D/g, '');
                        return (
                            <div
                                key={inq._id}
                                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-slate-700 transition"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <h3 className="text-base font-bold text-white">{inq.name}</h3>
                                            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span>{new Date(inq.createdAt).toLocaleString()}</span>
                                            </div>
                                        </div>

                                        <select
                                            value={inq.status}
                                            onChange={(e) => handleStatusChange(inq._id, e.target.value)}
                                            className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border focus:outline-none transition cursor-pointer ${
                                                inq.status === 'new'
                                                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                                    : inq.status === 'contacted'
                                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                                    : inq.status === 'in-review'
                                                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                                                    : 'bg-slate-800 text-slate-400 border-slate-700'
                                            }`}
                                        >
                                            <option value="new" className="bg-slate-900 text-amber-400">New</option>
                                            <option value="in-review" className="bg-slate-900 text-blue-400">In Review</option>
                                            <option value="contacted" className="bg-slate-900 text-emerald-400">Contacted</option>
                                            <option value="closed" className="bg-slate-900 text-slate-400">Closed</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/80">
                                        <div>
                                            <span className="text-slate-500">Product:</span>
                                            <p className="font-semibold text-slate-200">{inq.product || 'General Inquiry'}</p>
                                        </div>

                                        {inq.dimensions && (
                                            <div>
                                                <span className="text-slate-500 flex items-center gap-1">
                                                    <Ruler className="w-3 h-3" /> Scope / Size:
                                                </span>
                                                <p className="font-semibold text-slate-200">{inq.dimensions}</p>
                                            </div>
                                        )}

                                        {inq.location && (
                                            <div>
                                                <span className="text-slate-500 flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" /> Site Location:
                                                </span>
                                                <p className="font-semibold text-slate-200">{inq.location}</p>
                                            </div>
                                        )}
                                    </div>

                                    {inq.requirements && (
                                        <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/60 text-xs">
                                            <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider mb-1">
                                                Client Notes:
                                            </span>
                                            <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                                                {inq.requirements}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <a
                                            href={`tel:${inq.phone}`}
                                            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-yellow-400/10 hover:bg-yellow-400 text-yellow-300 hover:text-slate-950 border border-yellow-400/20 px-3 py-1.5 rounded-lg transition cursor-pointer"
                                        >
                                            <Phone className="w-3.5 h-3.5" />
                                            <span>Call</span>
                                        </a>

                                        <a
                                            href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hi ${inq.name}, this is from Rajasthanwall Infratech regarding your quote request.`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/20 px-3 py-1.5 rounded-lg transition cursor-pointer"
                                        >
                                            <MessageCircle className="w-3.5 h-3.5" />
                                            <span>WhatsApp</span>
                                        </a>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleDelete(inq._id)}
                                        className="text-slate-500 hover:text-rose-400 p-2 rounded-lg hover:bg-slate-800 transition cursor-pointer"
                                        title="Delete Lead"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
