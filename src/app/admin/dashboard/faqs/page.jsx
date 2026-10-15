'use client';

import { useState, useEffect } from 'react';
import {
    HelpCircle,
    Plus,
    Trash2,
    Eye,
    EyeOff,
    Loader2,
    ChevronDown,
} from 'lucide-react';

export default function FaqsAdminPage() {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newFaq, setNewFaq] = useState({
        question: '',
        answer: '',
        category: 'Technical',
    });
    const [submitting, setSubmitting] = useState(false);

    function loadFaqs() {
        setLoading(true);
        fetch('/api/admin/faqs')
            .then((r) => r.json())
            .then((res) => {
                if (res.success) setFaqs(res.faqs);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }

    useEffect(() => {
        loadFaqs();
    }, []);

    async function handleTogglePublish(id, currentPublished) {
        try {
            const res = await fetch('/api/admin/faqs', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, published: !currentPublished }),
            });
            const data = await res.json();
            if (data.success) {
                setFaqs((prev) =>
                    prev.map((f) => (f._id === id ? { ...f, published: !currentPublished } : f))
                );
            }
        } catch (err) {
            console.error('Failed to toggle FAQ status:', err);
        }
    }

    async function handleDelete(id) {
        if (!confirm('Are you sure you want to delete this FAQ?')) return;
        try {
            const res = await fetch(`/api/admin/faqs?id=${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                setFaqs((prev) => prev.filter((f) => f._id !== id));
            }
        } catch (err) {
            console.error('Failed to delete FAQ:', err);
        }
    }

    async function handleAddFaq(e) {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch('/api/admin/faqs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newFaq),
            });
            const data = await res.json();
            if (data.success) {
                setFaqs((prev) => [...prev, data.faq]);
                setShowAddModal(false);
                setNewFaq({ question: '', answer: '', category: 'Technical' });
            }
        } catch (err) {
            alert('Failed to save FAQ.');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-3">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 shrink-0" />
                    <span>FAQ Manager</span>
                </h1>

                <button
                    type="button"
                    onClick={() => setShowAddModal(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold bg-yellow-400 hover:bg-yellow-300 text-slate-950 px-3.5 py-2 rounded-xl transition shadow-lg shadow-yellow-400/10 cursor-pointer shrink-0"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add FAQ</span>
                </button>
            </div>

            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
                </div>
            ) : faqs.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
                    No FAQs found. Click "Add New FAQ" to create your first question.
                </div>
            ) : (
                <div className="space-y-3">
                    {faqs.map((faq, index) => (
                        <div
                            key={faq._id}
                            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition space-y-3"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold uppercase tracking-wider bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-2 py-0.5 rounded">
                                            {faq.category || 'General'}
                                        </span>
                                        <span className="text-xs text-slate-500 font-mono">#{index + 1}</span>
                                    </div>
                                    <h3 className="text-sm font-bold text-white">{faq.question}</h3>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => handleTogglePublish(faq._id, faq.published)}
                                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer transition ${
                                            faq.published
                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                                        }`}
                                    >
                                        {faq.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                        <span>{faq.published ? 'Live' : 'Hidden'}</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleDelete(faq._id)}
                                        className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
                                        title="Delete FAQ"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-800/80">
                                {faq.answer}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Add FAQ Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                            <h3 className="text-base font-bold text-white">Add New FAQ</h3>
                            <button
                                type="button"
                                onClick={() => setShowAddModal(false)}
                                className="text-slate-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleAddFaq} className="space-y-4 text-xs">
                            <div>
                                <label className="block text-slate-400 font-medium mb-1.5">Category</label>
                                <select
                                    value={newFaq.category}
                                    onChange={(e) => setNewFaq({ ...newFaq, category: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-yellow-500/50"
                                >
                                    <option value="General">General Inquiries</option>
                                    <option value="Technical">Technical Specifications</option>
                                    <option value="Installation">Installation & Groundwork</option>
                                    <option value="Pricing">Pricing & Delivery</option>
                                    <option value="Durability">Durability & Strength</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-slate-400 font-medium mb-1.5">Question *</label>
                                <input
                                    type="text"
                                    required
                                    value={newFaq.question}
                                    onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                                    placeholder="e.g. How long does installation take?"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-yellow-500/50"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-400 font-medium mb-1.5">Answer *</label>
                                <textarea
                                    rows={4}
                                    required
                                    value={newFaq.answer}
                                    onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                                    placeholder="Provide clear engineering explanation..."
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
                                    {submitting ? 'Saving...' : 'Add FAQ'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
