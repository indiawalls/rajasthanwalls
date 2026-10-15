'use client';

import { useState, useEffect } from 'react';
import {
    MessageSquareQuote,
    Star,
    Plus,
    Trash2,
    Check,
    Eye,
    EyeOff,
    Loader2,
    MapPin,
    Building2,
} from 'lucide-react';

export default function TestimonialsAdminPage() {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newReview, setNewReview] = useState({
        name: '',
        role: '',
        location: '',
        rating: 5,
        quote: '',
    });
    const [submitting, setSubmitting] = useState(false);

    function loadTestimonials() {
        setLoading(true);
        fetch('/api/admin/testimonials')
            .then((r) => r.json())
            .then((res) => {
                if (res.success) setTestimonials(res.testimonials);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }

    useEffect(() => {
        loadTestimonials();
    }, []);

    async function handleTogglePublish(id, currentPublished) {
        try {
            const res = await fetch('/api/admin/testimonials', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, published: !currentPublished }),
            });
            const data = await res.json();
            if (data.success) {
                setTestimonials((prev) =>
                    prev.map((t) => (t._id === id ? { ...t, published: !currentPublished } : t))
                );
            }
        } catch (err) {
            console.error('Failed to toggle testimonial status:', err);
        }
    }

    async function handleDelete(id) {
        if (!confirm('Are you sure you want to delete this testimonial?')) return;
        try {
            const res = await fetch(`/api/admin/testimonials?id=${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                setTestimonials((prev) => prev.filter((t) => t._id !== id));
            }
        } catch (err) {
            console.error('Failed to delete testimonial:', err);
        }
    }

    async function handleAddTestimonial(e) {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch('/api/admin/testimonials', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newReview),
            });
            const data = await res.json();
            if (data.success) {
                setTestimonials((prev) => [data.testimonial, ...prev]);
                setShowAddModal(false);
                setNewReview({ name: '', role: '', location: '', rating: 5, quote: '' });
            }
        } catch (err) {
            alert('Failed to save review.');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-3">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                    <MessageSquareQuote className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 shrink-0" />
                    <span>Client Reviews</span>
                </h1>

                <button
                    type="button"
                    onClick={() => setShowAddModal(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold bg-yellow-400 hover:bg-yellow-300 text-slate-950 px-3.5 py-2 rounded-xl transition shadow-lg shadow-yellow-400/10 cursor-pointer shrink-0"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Review</span>
                </button>
            </div>

            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
                </div>
            ) : testimonials.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
                    No testimonials yet. Click "Add New Review" to publish customer feedback.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {testimonials.map((item) => (
                        <div
                            key={item._id}
                            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-slate-700 transition"
                        >
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1 text-amber-400">
                                        {Array.from({ length: item.rating || 5 }).map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleTogglePublish(item._id, item.published)}
                                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer transition ${
                                            item.published
                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                                        }`}
                                    >
                                        {item.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                        <span>{item.published ? 'Live' : 'Hidden'}</span>
                                    </button>
                                </div>

                                <blockquote className="text-xs text-slate-300 italic leading-relaxed">
                                    "{item.quote}"
                                </blockquote>

                                <div className="pt-3 border-t border-slate-800/80 space-y-1">
                                    <h4 className="text-sm font-bold text-white">{item.name}</h4>
                                    {item.role && (
                                        <p className="text-[11px] text-slate-400 flex items-center gap-1">
                                            <Building2 className="w-3 h-3" /> {item.role}
                                        </p>
                                    )}
                                    {item.location && (
                                        <p className="text-[11px] text-slate-500 flex items-center gap-1">
                                            <MapPin className="w-3 h-3" /> {item.location}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="pt-3 border-t border-slate-800 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => handleDelete(item._id)}
                                    className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
                                    title="Delete Review"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Review Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                            <h3 className="text-base font-bold text-white">Add Client Review</h3>
                            <button
                                type="button"
                                onClick={() => setShowAddModal(false)}
                                className="text-slate-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleAddTestimonial} className="space-y-4 text-xs">
                            <div>
                                <label className="block text-slate-400 font-medium mb-1.5">Client Full Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={newReview.name}
                                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                                    placeholder="e.g. Rajesh Sharma"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-yellow-500/50"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-slate-400 font-medium mb-1.5">Role / Project</label>
                                    <input
                                        type="text"
                                        value={newReview.role}
                                        onChange={(e) => setNewReview({ ...newReview, role: e.target.value })}
                                        placeholder="e.g. Site Manager, Industrial Park"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-yellow-500/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-400 font-medium mb-1.5">Location</label>
                                    <input
                                        type="text"
                                        value={newReview.location}
                                        onChange={(e) => setNewReview({ ...newReview, location: e.target.value })}
                                        placeholder="e.g. Bhiwadi, Alwar"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-yellow-500/50"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-400 font-medium mb-1.5">Rating (1 to 5 Stars)</label>
                                <select
                                    value={newReview.rating}
                                    onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-yellow-500/50"
                                >
                                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars - Excellent)</option>
                                    <option value={4}>⭐⭐⭐⭐ (4 Stars - Very Good)</option>
                                    <option value={3}>⭐⭐⭐ (3 Stars - Good)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-slate-400 font-medium mb-1.5">Customer Quote *</label>
                                <textarea
                                    rows={3}
                                    required
                                    value={newReview.quote}
                                    onChange={(e) => setNewReview({ ...newReview, quote: e.target.value })}
                                    placeholder="Enter client testimonial text..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-yellow-500/50"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-5 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold shadow-lg shadow-yellow-400/10 cursor-pointer"
                                >
                                    {submitting ? 'Saving...' : 'Publish Testimonial'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
