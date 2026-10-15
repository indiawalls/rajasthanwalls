'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
    Package,
    Plus,
    Trash2,
    Eye,
    EyeOff,
    Loader2,
    Tag,
    ListChecks,
    CheckCircle2,
    X,
} from 'lucide-react';

export default function ProductsAdminPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [feedback, setFeedback] = useState({ text: '', type: '' });

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        badge: '',
        description: '',
        longDescription: '',
        image: '',
        specs: '',
        order: 0,
        published: true,
    });

    function loadProducts() {
        setLoading(true);
        fetch('/api/admin/products')
            .then((r) => r.json())
            .then((res) => {
                if (res.success) setProducts(res.products);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }

    useEffect(() => {
        loadProducts();
    }, []);

    async function handleTogglePublish(id, currentPublished) {
        try {
            const res = await fetch('/api/admin/products', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, published: !currentPublished }),
            });
            const data = await res.json();
            if (data.success) {
                setProducts((prev) =>
                    prev.map((p) => (p._id === id ? { ...p, published: !currentPublished } : p))
                );
            }
        } catch (err) {
            console.error('Failed to toggle product status:', err);
        }
    }

    async function handleDelete(id, title) {
        if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
        try {
            const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                setProducts((prev) => prev.filter((p) => p._id !== id));
            }
        } catch (err) {
            console.error('Failed to delete product:', err);
        }
    }

    async function handleAddProduct(e) {
        e.preventDefault();
        setSubmitting(true);
        setFeedback({ text: '', type: '' });

        try {
            const payload = {
                ...formData,
                order: Number(formData.order) || 0,
                specs: formData.specs
                    .split('\n')
                    .map((s) => s.trim())
                    .filter(Boolean),
            };

            const res = await fetch('/api/admin/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();

            if (data.success) {
                setProducts((prev) => [data.product, ...prev]);
                setShowAddModal(false);
                setFormData({
                    title: '',
                    slug: '',
                    badge: '',
                    description: '',
                    longDescription: '',
                    image: '',
                    specs: '',
                    order: 0,
                    published: true,
                });
                setFeedback({ text: 'Product added successfully!', type: 'success' });
            } else {
                setFeedback({ text: data.error || 'Failed to add product', type: 'error' });
            }
        } catch (err) {
            setFeedback({ text: 'Error adding product', type: 'error' });
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
                <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <Package className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 shrink-0" />
                    <span>Products Catalog</span>
                </h1>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="inline-flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs transition shadow-lg shadow-yellow-400/10 cursor-pointer shrink-0"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Product</span>
                </button>
            </div>

            {feedback.text && (
                <div
                    className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
                        feedback.type === 'success'
                            ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                            : 'bg-rose-950/40 border-rose-800 text-rose-300'
                    }`}
                >
                    <span>{feedback.text}</span>
                    <button onClick={() => setFeedback({ text: '', type: '' })} className="hover:opacity-75">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Products Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-24 text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin text-yellow-400 mr-2" />
                    <span className="text-xs">Loading catalog products...</span>
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-2xl">
                    <Package className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm font-semibold">No products found in database</p>
                    <p className="text-slate-500 text-xs mt-1">Add your first precast product to populate the catalog.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {products.map((p) => {
                        const imageSrc = p.image?.startsWith('http')
                            ? p.image
                            : `${process.env.NEXT_PUBLIC_IMAGES}/${p.image?.replace(/^\/+/, '')}`;

                        return (
                            <div
                                key={p._id}
                                className={`bg-slate-900 border rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-200 ${
                                    p.published ? 'border-slate-800 hover:border-slate-700' : 'border-slate-800/60 opacity-60'
                                }`}
                            >
                                <div>
                                    <div className="relative h-44 w-full bg-slate-950">
                                        <Image
                                            src={imageSrc}
                                            alt={p.title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                        />
                                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                                            {p.badge && (
                                                <span className="bg-yellow-400 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow">
                                                    {p.badge}
                                                </span>
                                            )}
                                        </div>
                                        <div className="absolute top-3 right-3">
                                            <span
                                                className={`text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur ${
                                                    p.published
                                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                                }`}
                                            >
                                                {p.published ? 'Published' : 'Hidden'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-4 space-y-2.5">
                                        <div>
                                            <h3 className="font-bold text-sm text-white line-clamp-1">{p.title}</h3>
                                            <p className="text-[11px] text-yellow-400 font-mono mt-0.5">/{p.slug}</p>
                                        </div>

                                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                            {p.description}
                                        </p>

                                        {p.specs && p.specs.length > 0 && (
                                            <div className="pt-2 border-t border-slate-800 space-y-1">
                                                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                                    <ListChecks className="w-3 h-3 text-slate-400" />
                                                    <span>Key Specs ({p.specs.length})</span>
                                                </div>
                                                <div className="flex flex-wrap gap-1">
                                                    {p.specs.slice(0, 3).map((s, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700/60"
                                                        >
                                                            {s}
                                                        </span>
                                                    ))}
                                                    {p.specs.length > 3 && (
                                                        <span className="text-[10px] text-slate-500 self-center">
                                                            +{p.specs.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between text-xs">
                                    <span className="text-[10px] text-slate-500 font-mono">Order: #{p.order ?? 0}</span>
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            onClick={() => handleTogglePublish(p._id, p.published)}
                                            className={`p-1.5 rounded-lg border transition cursor-pointer ${
                                                p.published
                                                    ? 'border-emerald-800/60 text-emerald-400 hover:bg-emerald-950/40'
                                                    : 'border-slate-700 text-slate-400 hover:bg-slate-800'
                                            }`}
                                            title={p.published ? 'Unpublish' : 'Publish'}
                                        >
                                            {p.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(p._id, p.title)}
                                            className="p-1.5 rounded-lg border border-rose-900/40 text-rose-400 hover:bg-rose-950/40 transition cursor-pointer"
                                            title="Delete product"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add Product Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <h2 className="text-base font-bold text-white flex items-center gap-2">
                                <Plus className="w-4 h-4 text-yellow-400" />
                                <span>Add New Precast Product</span>
                            </h2>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleAddProduct} className="space-y-3.5 text-xs">
                            <div>
                                <label className="block text-slate-300 font-semibold mb-1">Product Title *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Folding Precast Boundary Wall"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            title: e.target.value,
                                            slug: e.target.value
                                                .toLowerCase()
                                                .replace(/[^a-z0-9]+/g, '-')
                                                .replace(/(^-|-$)+/g, ''),
                                        })
                                    }
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-yellow-400"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-slate-300 font-semibold mb-1">URL Slug *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="folding-precast-boundary-wall"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-hidden focus:border-yellow-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-300 font-semibold mb-1">Badge (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. BESTSELLER"
                                        value={formData.badge}
                                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-yellow-400"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-300 font-semibold mb-1">Image Filename in Supabase *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. folding-wall.png or full Supabase URL"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-yellow-400 font-mono"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-300 font-semibold mb-1">Short Description *</label>
                                <textarea
                                    required
                                    rows={2}
                                    placeholder="Brief overview of product features and dimensions..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-yellow-400 resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-300 font-semibold mb-1">Specifications (One per line)</label>
                                <textarea
                                    rows={3}
                                    placeholder={"Concrete Grade: M-30 High Strength\nPanel Thickness: 50mm\nHigh-Tensile Prestressed Steel Strands"}
                                    value={formData.specs}
                                    onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-yellow-400 font-mono text-[11px]"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-slate-300 font-semibold mb-1">Display Order</label>
                                    <input
                                        type="number"
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-yellow-400"
                                    />
                                </div>
                                <div className="flex items-center gap-2 pt-2 sm:pt-6">
                                    <input
                                        type="checkbox"
                                        id="published"
                                        checked={formData.published}
                                        onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                                        className="rounded border-slate-700 bg-slate-950 text-yellow-400 focus:ring-yellow-400"
                                    />
                                    <label htmlFor="published" className="text-slate-300 font-semibold cursor-pointer">
                                        Publish Immediately
                                    </label>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-4 py-2 rounded-lg bg-yellow-400 text-slate-950 hover:bg-yellow-300 font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            <span>Save Product</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
