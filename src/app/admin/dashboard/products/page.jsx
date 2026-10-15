'use client';

import { useState, useEffect, useRef } from 'react';
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
    Pencil,
    UploadCloud,
    Image as ImageIcon,
    HardDrive,
    Cloud,
    AlertCircle,
} from 'lucide-react';

export default function ProductsAdminPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [feedback, setFeedback] = useState({ text: '', type: '' });

    // Add Form State
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        badge: '',
        description: '',
        longDescription: '',
        specs: '',
        order: 0,
        published: true,
    });
    const [addImageFile, setAddImageFile] = useState(null);
    const [addImagePreview, setAddImagePreview] = useState('');
    const [addManualImage, setAddManualImage] = useState('');
    const [addUseManual, setAddUseManual] = useState(false);
    const addFileInputRef = useRef(null);

    // Edit Form State
    const [editFormData, setEditFormData] = useState({
        id: '',
        title: '',
        slug: '',
        badge: '',
        description: '',
        longDescription: '',
        specs: '',
        order: 0,
        published: true,
        currentImage: '',
    });
    const [editImageFile, setEditImageFile] = useState(null);
    const [editImagePreview, setEditImagePreview] = useState('');
    const [editManualImage, setEditManualImage] = useState('');
    const [editUseManual, setEditUseManual] = useState(false);
    const editFileInputRef = useRef(null);

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

    // Cleanup object URLs on unmount
    useEffect(() => {
        return () => {
            if (addImagePreview && addImagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(addImagePreview);
            }
            if (editImagePreview && editImagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(editImagePreview);
            }
        };
    }, [addImagePreview, editImagePreview]);

    function resolveImageSrc(img) {
        if (!img) return '';
        if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:') || img.startsWith('/')) {
            return img;
        }
        const prefix = (process.env.NEXT_PUBLIC_IMAGES || '').replace(/\/+$/, '');
        return prefix ? `${prefix}/${img.replace(/^\/+/, '')}` : `/${img.replace(/^\/+/, '')}`;
    }

    // Handle Add Modal file selection
    function handleAddFileSelect(file) {
        if (!file) return;
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            setFeedback({ text: 'Only JPG, PNG or WebP images are allowed.', type: 'error' });
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setFeedback({ text: 'Image must be under 5MB.', type: 'error' });
            return;
        }
        if (addImagePreview && addImagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(addImagePreview);
        }
        setAddImageFile(file);
        setAddImagePreview(URL.createObjectURL(file));
    }

    // Handle Edit Modal file selection
    function handleEditFileSelect(file) {
        if (!file) return;
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            setFeedback({ text: 'Only JPG, PNG or WebP images are allowed.', type: 'error' });
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setFeedback({ text: 'Image must be under 5MB.', type: 'error' });
            return;
        }
        if (editImagePreview && editImagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(editImagePreview);
        }
        setEditImageFile(file);
        setEditImagePreview(URL.createObjectURL(file));
    }

    function openEditModal(product) {
        if (editImagePreview && editImagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(editImagePreview);
        }
        setEditFormData({
            id: product._id,
            title: product.title || '',
            slug: product.slug || '',
            badge: product.badge || '',
            description: product.description || '',
            longDescription: product.longDescription || '',
            specs: Array.isArray(product.specs) ? product.specs.join('\n') : '',
            order: product.order ?? 0,
            published: product.published ?? true,
            currentImage: product.image || '',
        });
        setEditImageFile(null);
        setEditImagePreview('');
        setEditManualImage(product.image || '');
        setEditUseManual(false);
        setShowEditModal(true);
    }

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
        if (!confirm(`Are you sure you want to delete "${title}"? This will permanently remove the product and its image from storage.`)) return;
        try {
            const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                setProducts((prev) => prev.filter((p) => p._id !== id));
                setFeedback({ text: `Product "${title}" deleted successfully.`, type: 'success' });
            } else {
                setFeedback({ text: data.error || 'Failed to delete product', type: 'error' });
            }
        } catch (err) {
            console.error('Failed to delete product:', err);
            setFeedback({ text: 'Error deleting product', type: 'error' });
        }
    }

    async function handleAddProduct(e) {
        e.preventDefault();
        if (!addImageFile && (!addUseManual || !addManualImage.trim())) {
            setFeedback({ text: 'Please select an image file to upload.', type: 'error' });
            return;
        }

        setSubmitting(true);
        setFeedback({ text: '', type: '' });

        try {
            const body = new FormData();
            body.append('title', formData.title.trim());
            body.append('slug', formData.slug.trim());
            body.append('badge', formData.badge.trim());
            body.append('description', formData.description.trim());
            body.append('longDescription', formData.longDescription.trim());
            body.append('specs', formData.specs);
            body.append('order', String(formData.order ?? 0));
            body.append('published', String(formData.published));

            if (addImageFile) {
                body.append('imageFile', addImageFile);
            } else if (addUseManual && addManualImage.trim()) {
                body.append('image', addManualImage.trim());
            }

            const res = await fetch('/api/admin/products', {
                method: 'POST',
                body,
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
                    specs: '',
                    order: 0,
                    published: true,
                });
                if (addImagePreview && addImagePreview.startsWith('blob:')) {
                    URL.revokeObjectURL(addImagePreview);
                }
                setAddImageFile(null);
                setAddImagePreview('');
                setAddManualImage('');
                setAddUseManual(false);
                setFeedback({ text: 'Product created and image saved successfully!', type: 'success' });
            } else {
                setFeedback({ text: data.error || 'Failed to add product', type: 'error' });
            }
        } catch (err) {
            setFeedback({ text: 'Error adding product: ' + err.message, type: 'error' });
        } finally {
            setSubmitting(false);
        }
    }

    async function handleUpdateProduct(e) {
        e.preventDefault();
        setSubmitting(true);
        setFeedback({ text: '', type: '' });

        try {
            const body = new FormData();
            body.append('id', editFormData.id);
            body.append('title', editFormData.title.trim());
            body.append('slug', editFormData.slug.trim());
            body.append('badge', editFormData.badge.trim());
            body.append('description', editFormData.description.trim());
            body.append('longDescription', editFormData.longDescription.trim());
            body.append('specs', editFormData.specs);
            body.append('order', String(editFormData.order ?? 0));
            body.append('published', String(editFormData.published));

            if (editImageFile) {
                body.append('imageFile', editImageFile);
            } else if (editUseManual && editManualImage.trim()) {
                body.append('image', editManualImage.trim());
            }

            const res = await fetch('/api/admin/products', {
                method: 'PATCH',
                body,
            });
            const data = await res.json();

            if (data.success) {
                setProducts((prev) =>
                    prev.map((p) => (p._id === editFormData.id ? data.product : p))
                );
                setShowEditModal(false);
                if (editImagePreview && editImagePreview.startsWith('blob:')) {
                    URL.revokeObjectURL(editImagePreview);
                }
                setEditImageFile(null);
                setEditImagePreview('');
                setFeedback({ text: `Product "${data.product.title}" updated successfully!`, type: 'success' });
            } else {
                setFeedback({ text: data.error || 'Failed to update product', type: 'error' });
            }
        } catch (err) {
            setFeedback({ text: 'Error updating product: ' + err.message, type: 'error' });
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
                        const imageSrc = resolveImageSrc(p.image);
                        const isFallback = p.image?.startsWith('data:');

                        return (
                            <div
                                key={p._id}
                                className={`bg-slate-900 border rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-200 ${
                                    p.published ? 'border-slate-800 hover:border-slate-700' : 'border-slate-800/60 opacity-60'
                                }`}
                            >
                                <div>
                                    <div className="relative h-44 w-full bg-slate-950">
                                        {imageSrc ? (
                                            <Image
                                                src={imageSrc}
                                                alt={p.title}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                                unoptimized={imageSrc.startsWith('data:')}
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-slate-600 text-xs">
                                                No image
                                            </div>
                                        )}
                                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                                            {p.badge && (
                                                <span className="bg-yellow-400 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow">
                                                    {p.badge}
                                                </span>
                                            )}
                                        </div>
                                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                                            {isFallback && (
                                                <span
                                                    className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur flex items-center gap-1"
                                                    title="Saved in Database Fallback"
                                                >
                                                    <HardDrive className="w-2.5 h-2.5" />
                                                    <span>DB</span>
                                                </span>
                                            )}
                                            {!isFallback && p.image?.startsWith('products/') && (
                                                <span
                                                    className="bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur flex items-center gap-1"
                                                    title="Saved in Supabase Storage"
                                                >
                                                    <Cloud className="w-2.5 h-2.5" />
                                                    <span>Storage</span>
                                                </span>
                                            )}
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
                                            onClick={() => openEditModal(p)}
                                            className="p-1.5 rounded-lg border border-slate-700 text-slate-300 hover:text-yellow-400 hover:bg-slate-800 transition cursor-pointer"
                                            title="Edit product"
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                        </button>
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

                            {/* Product Image Upload Section */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="block text-slate-300 font-semibold">Product Image *</label>
                                    <button
                                        type="button"
                                        onClick={() => setAddUseManual(!addUseManual)}
                                        className="text-[11px] text-yellow-400 hover:text-yellow-300 underline"
                                    >
                                        {addUseManual ? 'Switch to file upload' : 'Enter URL / filename instead'}
                                    </button>
                                </div>

                                {!addUseManual ? (
                                    <div>
                                        <input
                                            type="file"
                                            ref={addFileInputRef}
                                            accept="image/jpeg,image/png,image/webp"
                                            onChange={(e) => handleAddFileSelect(e.target.files?.[0])}
                                            className="hidden"
                                        />

                                        {addImagePreview ? (
                                            <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950 p-2 flex items-center gap-3">
                                                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-900 shrink-0">
                                                    <img
                                                        src={addImagePreview}
                                                        alt="Upload preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="grow min-w-0">
                                                    <p className="text-white font-medium truncate text-xs">
                                                        {addImageFile?.name}
                                                    </p>
                                                    <p className="text-slate-400 text-[10px] mt-0.5">
                                                        {(addImageFile?.size / 1024).toFixed(1)} KB • Ready to save
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (addImagePreview.startsWith('blob:')) URL.revokeObjectURL(addImagePreview);
                                                        setAddImageFile(null);
                                                        setAddImagePreview('');
                                                        if (addFileInputRef.current) addFileInputRef.current.value = '';
                                                    }}
                                                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg shrink-0"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div
                                                onClick={() => addFileInputRef.current?.click()}
                                                onDragOver={(e) => e.preventDefault()}
                                                onDrop={(e) => {
                                                    e.preventDefault();
                                                    handleAddFileSelect(e.dataTransfer.files?.[0]);
                                                }}
                                                className="border-2 border-dashed border-slate-700 hover:border-yellow-400/70 bg-slate-950/60 hover:bg-slate-950 rounded-xl p-4 text-center cursor-pointer transition group"
                                            >
                                                <UploadCloud className="w-7 h-7 mx-auto text-slate-500 group-hover:text-yellow-400 transition mb-1.5" />
                                                <p className="text-slate-300 font-semibold text-xs">
                                                    Click to select or drag & drop image
                                                </p>
                                                <p className="text-slate-500 text-[10px] mt-0.5">
                                                    JPG, PNG, or WebP (max 5MB) • Saves directly to storage
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <input
                                        type="text"
                                        placeholder="e.g. folding-wall.png or full Supabase URL"
                                        value={addManualImage}
                                        onChange={(e) => setAddManualImage(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-yellow-400 font-mono text-xs"
                                    />
                                )}
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
                                            <span>Saving Product...</span>
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

            {/* Edit Product Modal */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <h2 className="text-base font-bold text-white flex items-center gap-2">
                                <Pencil className="w-4 h-4 text-yellow-400" />
                                <span>Edit Precast Product</span>
                            </h2>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateProduct} className="space-y-3.5 text-xs">
                            <div>
                                <label className="block text-slate-300 font-semibold mb-1">Product Title *</label>
                                <input
                                    type="text"
                                    required
                                    value={editFormData.title}
                                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-yellow-400"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-slate-300 font-semibold mb-1">URL Slug *</label>
                                    <input
                                        type="text"
                                        required
                                        value={editFormData.slug}
                                        onChange={(e) => setEditFormData({ ...editFormData, slug: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-hidden focus:border-yellow-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-300 font-semibold mb-1">Badge (Optional)</label>
                                    <input
                                        type="text"
                                        value={editFormData.badge}
                                        onChange={(e) => setEditFormData({ ...editFormData, badge: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-yellow-400"
                                    />
                                </div>
                            </div>

                            {/* Image Section in Edit Modal */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="block text-slate-300 font-semibold">Product Image</label>
                                    <button
                                        type="button"
                                        onClick={() => setEditUseManual(!editUseManual)}
                                        className="text-[11px] text-yellow-400 hover:text-yellow-300 underline"
                                    >
                                        {editUseManual ? 'Switch to file upload' : 'Enter URL / filename instead'}
                                    </button>
                                </div>

                                {!editUseManual ? (
                                    <div className="space-y-2">
                                        {/* Current Image or New Preview */}
                                        <div className="flex items-center gap-3 p-2 bg-slate-950 rounded-xl border border-slate-800">
                                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-900 shrink-0">
                                                <img
                                                    src={editImagePreview || resolveImageSrc(editFormData.currentImage)}
                                                    alt="Product thumbnail"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="grow min-w-0">
                                                <p className="text-white font-medium truncate text-xs">
                                                    {editImageFile ? editImageFile.name : 'Current Image'}
                                                </p>
                                                <p className="text-slate-400 text-[10px] mt-0.5">
                                                    {editImageFile
                                                        ? `${(editImageFile.size / 1024).toFixed(1)} KB • New image ready`
                                                        : editFormData.currentImage?.startsWith('data:')
                                                        ? 'Stored in Database fallback'
                                                        : editFormData.currentImage?.slice(0, 35) + '...'}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => editFileInputRef.current?.click()}
                                                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-yellow-400 rounded-lg text-xs font-semibold shrink-0 cursor-pointer"
                                            >
                                                Change
                                            </button>
                                        </div>

                                        <input
                                            type="file"
                                            ref={editFileInputRef}
                                            accept="image/jpeg,image/png,image/webp"
                                            onChange={(e) => handleEditFileSelect(e.target.files?.[0])}
                                            className="hidden"
                                        />
                                    </div>
                                ) : (
                                    <input
                                        type="text"
                                        value={editManualImage}
                                        onChange={(e) => setEditManualImage(e.target.value)}
                                        placeholder="e.g. folding-wall.png or full Supabase URL"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-yellow-400 font-mono text-xs"
                                    />
                                )}
                            </div>

                            <div>
                                <label className="block text-slate-300 font-semibold mb-1">Short Description *</label>
                                <textarea
                                    required
                                    rows={2}
                                    value={editFormData.description}
                                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-yellow-400 resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-300 font-semibold mb-1">Specifications (One per line)</label>
                                <textarea
                                    rows={3}
                                    value={editFormData.specs}
                                    onChange={(e) => setEditFormData({ ...editFormData, specs: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-yellow-400 font-mono text-[11px]"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-slate-300 font-semibold mb-1">Display Order</label>
                                    <input
                                        type="number"
                                        value={editFormData.order}
                                        onChange={(e) => setEditFormData({ ...editFormData, order: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-yellow-400"
                                    />
                                </div>
                                <div className="flex items-center gap-2 pt-2 sm:pt-6">
                                    <input
                                        type="checkbox"
                                        id="editPublished"
                                        checked={editFormData.published}
                                        onChange={(e) => setEditFormData({ ...editFormData, published: e.target.checked })}
                                        className="rounded border-slate-700 bg-slate-950 text-yellow-400 focus:ring-yellow-400"
                                    />
                                    <label htmlFor="editPublished" className="text-slate-300 font-semibold cursor-pointer">
                                        Published
                                    </label>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
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
                                            <span>Updating Product...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            <span>Update Product</span>
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
