'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    FileText,
    Plus,
    Trash2,
    Eye,
    EyeOff,
    Loader2,
    Calendar,
    User,
    ExternalLink,
} from 'lucide-react';

export default function BlogsAdminPage() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newBlog, setNewBlog] = useState({
        title: '',
        category: 'Industry Insights',
        author: 'Rajasthanwall Engineering Desk',
        readTime: '4 min read',
        excerpt: '',
        content: '',
        coverImage: 'How-Precast-Walls-Save-Time-and-Add-Strength.png',
    });
    const [submitting, setSubmitting] = useState(false);

    function loadBlogs() {
        setLoading(true);
        fetch('/api/admin/blogs')
            .then((r) => r.json())
            .then((res) => {
                if (res.success) setBlogs(res.blogs);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }

    useEffect(() => {
        loadBlogs();
    }, []);

    async function handleTogglePublish(id, currentPublished) {
        try {
            const res = await fetch('/api/admin/blogs', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, published: !currentPublished }),
            });
            const data = await res.json();
            if (data.success) {
                setBlogs((prev) =>
                    prev.map((b) => (b._id === id ? { ...b, published: !currentPublished } : b))
                );
            }
        } catch (err) {
            console.error('Failed to toggle blog status:', err);
        }
    }

    async function handleDelete(id) {
        if (!confirm('Are you sure you want to delete this blog post?')) return;
        try {
            const res = await fetch(`/api/admin/blogs?id=${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                setBlogs((prev) => prev.filter((b) => b._id !== id));
            }
        } catch (err) {
            console.error('Failed to delete blog:', err);
        }
    }

    async function handleAddBlog(e) {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch('/api/admin/blogs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newBlog),
            });
            const data = await res.json();
            if (data.success) {
                setBlogs((prev) => [data.blog, ...prev]);
                setShowAddModal(false);
                setNewBlog({
                    title: '',
                    category: 'Industry Insights',
                    author: 'Rajasthanwall Engineering Desk',
                    readTime: '4 min read',
                    excerpt: '',
                    content: '',
                    coverImage: 'How-Precast-Walls-Save-Time-and-Add-Strength.png',
                });
            } else {
                alert(data.error || 'Failed to save blog post.');
            }
        } catch (err) {
            alert('Failed to save blog post.');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-3">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 shrink-0" />
                    <span>Blog Articles</span>
                </h1>

                <button
                    type="button"
                    onClick={() => setShowAddModal(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold bg-yellow-400 hover:bg-yellow-300 text-slate-950 px-3.5 py-2 rounded-xl transition shadow-lg shadow-yellow-400/10 cursor-pointer shrink-0"
                >
                    <Plus className="w-4 h-4" />
                    <span>New Article</span>
                </button>
            </div>

            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
                </div>
            ) : blogs.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
                    No blog posts yet. Click "Write New Article" to publish your first post.
                </div>
            ) : (
                <div className="space-y-4">
                    {blogs.map((b) => (
                        <div
                            key={b._id}
                            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition"
                        >
                            <div className="space-y-1.5 max-w-2xl">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold uppercase tracking-wider bg-yellow-400/10 text-yellow-300 border border-yellow-400/20 px-2 py-0.5 rounded">
                                        {b.category || 'Article'}
                                    </span>
                                    <span className="text-xs text-slate-500 font-mono">
                                        {b.readTime || '4 min read'}
                                    </span>
                                </div>

                                <h3 className="text-base font-bold text-white">
                                    {b.title}
                                </h3>

                                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                    {b.excerpt}
                                </p>

                                <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                                    <span className="flex items-center gap-1">
                                        <User className="w-3.5 h-3.5" /> {b.author}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {new Date(b.publishedAt || b.createdAt).toLocaleDateString()}
                                    </span>
                                    <Link
                                        href={`/blog/${b.slug}`}
                                        target="_blank"
                                        className="text-yellow-400 hover:text-yellow-300 inline-flex items-center gap-1 font-semibold"
                                    >
                                        <span>View on Site</span>
                                        <ExternalLink className="w-3 h-3" />
                                    </Link>
                                </div>
                            </div>

                            <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => handleTogglePublish(b._id, b.published)}
                                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer transition ${
                                        b.published
                                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                                    }`}
                                >
                                    {b.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                    <span>{b.published ? 'Published' : 'Draft'}</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleDelete(b._id)}
                                    className="text-slate-500 hover:text-rose-400 p-2 rounded-lg hover:bg-slate-800 transition cursor-pointer"
                                    title="Delete Article"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Blog Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                            <h3 className="text-base font-bold text-white">Write New Engineering Article</h3>
                            <button
                                type="button"
                                onClick={() => setShowAddModal(false)}
                                className="text-slate-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleAddBlog} className="space-y-4 text-xs">
                            <div>
                                <label className="block text-slate-400 font-medium mb-1.5">Article Title *</label>
                                <input
                                    type="text"
                                    required
                                    value={newBlog.title}
                                    onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                                    placeholder="e.g. Best Boundary Wall Solutions for Solar Plants"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-yellow-500/50"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-slate-400 font-medium mb-1.5">Category</label>
                                    <select
                                        value={newBlog.category}
                                        onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-yellow-500/50"
                                    >
                                        <option value="Industry Insights">Industry Insights</option>
                                        <option value="Technical Guides">Technical Guides</option>
                                        <option value="Material Comparisons">Material Comparisons</option>
                                        <option value="Case Studies">Case Studies</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-slate-400 font-medium mb-1.5">Author</label>
                                    <input
                                        type="text"
                                        value={newBlog.author}
                                        onChange={(e) => setNewBlog({ ...newBlog, author: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-yellow-500/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-400 font-medium mb-1.5">Read Time</label>
                                    <input
                                        type="text"
                                        value={newBlog.readTime}
                                        onChange={(e) => setNewBlog({ ...newBlog, readTime: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-yellow-500/50"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-400 font-medium mb-1.5">Short Summary / Excerpt *</label>
                                <textarea
                                    rows={2}
                                    required
                                    value={newBlog.excerpt}
                                    onChange={(e) => setNewBlog({ ...newBlog, excerpt: e.target.value })}
                                    placeholder="Brief overview shown on blog cards and Google search description..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-yellow-500/50"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-400 font-medium mb-1.5">Article Content (HTML / Text) *</label>
                                <textarea
                                    rows={8}
                                    required
                                    value={newBlog.content}
                                    onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                                    placeholder="Write your article body (supports <h2>, <p>, <ul>, <li> tags)..."
                                    className="w-full font-mono text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-yellow-500/50"
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
                                    {submitting ? 'Publishing...' : 'Publish Article'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
