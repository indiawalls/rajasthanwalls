'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    FolderKanban,
    Plus,
    Trash2,
    Eye,
    EyeOff,
    Loader2,
    MapPin,
    Pencil,
    X,
    CheckCircle2,
    HardDrive,
    Cloud,
} from 'lucide-react';

const COMMON_CATEGORIES = [
    'Precast Boundary Walls',
    'Complete Security Walls',
    'Paver Blocks',
    'Solar Plant Boundary',
    'Industrial Boundary Walls',
    'Agricultural Fencing',
    'Residential Society Walls',
];

export default function ProjectsAdminPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [feedback, setFeedback] = useState({ text: '', type: '' });

    // Edit Form State
    const [editFormData, setEditFormData] = useState({
        id: '',
        title: '',
        category: 'Precast Boundary Walls',
        location: '',
        description: '',
        longDescription: '',
        order: 0,
        published: true,
        currentImage: '',
    });
    const [editImageFile, setEditImageFile] = useState(null);
    const [editImagePreview, setEditImagePreview] = useState('');
    const [editManualImage, setEditManualImage] = useState('');
    const [editUseManual, setEditUseManual] = useState(false);
    const editFileInputRef = useRef(null);

    function loadProjects() {
        setLoading(true);
        fetch('/api/admin/projects')
            .then((r) => r.json())
            .then((res) => {
                if (res.success) setProjects(res.projects);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }

    useEffect(() => {
        loadProjects();
    }, []);

    // Cleanup object URLs on unmount
    useEffect(() => {
        return () => {
            if (editImagePreview && editImagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(editImagePreview);
            }
        };
    }, [editImagePreview]);

    function resolveImageSrc(path) {
        if (!path) return '';
        if (/^(?:https?:\/\/|data:)/.test(path)) return path;

        const encodedPath = (path.startsWith('/') ? path : `/${path}`).replace(/ /g, '%20');
        if (encodedPath.startsWith('/images/')) return encodedPath;

        const imageBaseUrl = (process.env.NEXT_PUBLIC_IMAGES || '').replace(/\/+$/, '');
        return imageBaseUrl ? `${imageBaseUrl}${encodedPath}` : encodedPath;
    }

    function handleEditFileSelect(file) {
        if (!file) return;
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            setFeedback({ text: 'Only JPG, PNG or WebP images are allowed.', type: 'error' });
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setFeedback({ text: 'Project image must be under 5MB.', type: 'error' });
            return;
        }
        if (editImagePreview && editImagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(editImagePreview);
        }
        setEditImageFile(file);
        setEditImagePreview(URL.createObjectURL(file));
    }

    function openEditModal(project) {
        if (editImagePreview && editImagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(editImagePreview);
        }
        setEditFormData({
            id: project._id,
            title: project.title || '',
            category: project.category || 'Precast Boundary Walls',
            location: project.location || '',
            description: project.description || '',
            longDescription: project.longDescription || '',
            order: project.order ?? 0,
            published: project.published ?? true,
            currentImage: project.image || '',
        });
        setEditImageFile(null);
        setEditImagePreview('');
        setEditManualImage(project.image || '');
        setEditUseManual(false);
        setShowEditModal(true);
    }

    async function handleTogglePublish(id, currentPublished) {
        try {
            const res = await fetch('/api/admin/projects', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, published: !currentPublished }),
            });
            const data = await res.json();
            if (data.success) {
                setProjects((prev) =>
                    prev.map((p) => (p._id === id ? { ...p, published: !currentPublished } : p))
                );
            }
        } catch (err) {
            console.error('Failed to toggle project status:', err);
        }
    }

    async function handleDelete(id, title) {
        if (!confirm(`Are you sure you want to delete "${title || 'this project'}"? This will also remove the cover photo from Supabase storage.`)) return;
        try {
            const res = await fetch(`/api/admin/projects?id=${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                setProjects((prev) => prev.filter((p) => p._id !== id));
                setFeedback({ text: 'Project deleted successfully.', type: 'success' });
            } else {
                setFeedback({ text: data.error || 'Failed to delete project', type: 'error' });
            }
        } catch (err) {
            console.error('Failed to delete project:', err);
            setFeedback({ text: 'Error deleting project', type: 'error' });
        }
    }

    async function handleUpdateProject(e) {
        e.preventDefault();
        setSubmitting(true);
        setFeedback({ text: '', type: '' });

        try {
            const body = new FormData();
            body.append('id', editFormData.id);
            body.append('title', editFormData.title.trim());
            body.append('category', editFormData.category.trim());
            body.append('location', editFormData.location.trim());
            body.append('description', editFormData.description.trim());
            body.append('longDescription', editFormData.longDescription.trim());
            body.append('order', String(editFormData.order ?? 0));
            body.append('published', String(editFormData.published));

            if (editImageFile) {
                body.append('imageFile', editImageFile);
            } else if (editUseManual && editManualImage.trim()) {
                body.append('image', editManualImage.trim());
            }

            const res = await fetch('/api/admin/projects', {
                method: 'PATCH',
                body,
            });
            const data = await res.json();

            if (data.success) {
                setProjects((prev) =>
                    prev.map((p) => (p._id === editFormData.id ? data.project : p))
                );
                setShowEditModal(false);
                if (editImagePreview && editImagePreview.startsWith('blob:')) {
                    URL.revokeObjectURL(editImagePreview);
                }
                setEditImageFile(null);
                setEditImagePreview('');
                setFeedback({ text: `Project "${data.project.title}" updated successfully!`, type: 'success' });
            } else {
                setFeedback({ text: data.error || 'Failed to update project', type: 'error' });
            }
        } catch (err) {
            setFeedback({ text: 'Error updating project: ' + err.message, type: 'error' });
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                    <FolderKanban className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 shrink-0" />
                    <span>Projects Portfolio</span>
                </h1>

                <Link
                    href="/admin/form-panel"
                    className="inline-flex items-center gap-1.5 text-xs font-bold bg-yellow-400 hover:bg-yellow-300 text-slate-950 px-3.5 py-2 rounded-xl transition shadow-lg shadow-yellow-400/10 cursor-pointer shrink-0"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Project</span>
                </Link>
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

            {/* Projects Grid */}
            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
                </div>
            ) : projects.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
                    No projects found. Click "Add Project" to upload your first portfolio item.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {projects.map((proj) => {
                        const imgUrl = resolveImageSrc(proj.image);
                        const isFallback = proj.image?.startsWith('data:');

                        return (
                            <div
                                key={proj._id}
                                className={`bg-slate-900 border rounded-2xl overflow-hidden flex flex-col justify-between transition group ${
                                    proj.published ? 'border-slate-800 hover:border-slate-700' : 'border-slate-800/60 opacity-60'
                                }`}
                            >
                                <div>
                                    <div className="relative aspect-video bg-slate-950 overflow-hidden">
                                        {imgUrl ? (
                                            <Image
                                                src={imgUrl}
                                                alt={proj.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                unoptimized={imgUrl.startsWith('data:')}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">
                                                No Image
                                            </div>
                                        )}
                                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                                            <span className="bg-slate-900/90 backdrop-blur text-yellow-300 text-[10px] font-bold px-2 py-0.5 rounded shadow">
                                                {proj.category || 'Boundary Wall'}
                                            </span>
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
                                            {!isFallback && proj.image && (proj.image.startsWith('projects/') || proj.image.startsWith('/')) && (
                                                <span
                                                    className="bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur flex items-center gap-1"
                                                    title="Stored in Supabase Storage"
                                                >
                                                    <Cloud className="w-2.5 h-2.5" />
                                                    <span>Storage</span>
                                                </span>
                                            )}
                                            <span
                                                className={`text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur ${
                                                    proj.published
                                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                                }`}
                                            >
                                                {proj.published ? 'Live' : 'Hidden'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-5 space-y-2">
                                        <h3 className="text-sm font-bold text-white group-hover:text-yellow-400 transition">
                                            {proj.title}
                                        </h3>
                                        <p className="text-[11px] text-slate-400 flex items-center gap-1">
                                            <MapPin className="w-3 h-3 text-slate-500" />
                                            <span>{proj.location}</span>
                                        </p>
                                        {proj.description && (
                                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed pt-1">
                                                {proj.description}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between text-xs">
                                    <span className="text-[10px] text-slate-500 font-mono">Order: #{proj.order ?? 0}</span>
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            onClick={() => openEditModal(proj)}
                                            className="p-1.5 rounded-lg border border-slate-700 text-slate-300 hover:text-yellow-400 hover:bg-slate-800 transition cursor-pointer"
                                            title="Edit Project"
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => handleTogglePublish(proj._id, proj.published)}
                                            className={`p-1.5 rounded-lg border transition cursor-pointer ${
                                                proj.published
                                                    ? 'border-emerald-800/60 text-emerald-400 hover:bg-emerald-950/40'
                                                    : 'border-slate-700 text-slate-400 hover:bg-slate-800'
                                            }`}
                                            title={proj.published ? 'Unpublish' : 'Publish'}
                                        >
                                            {proj.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(proj._id, proj.title)}
                                            className="p-1.5 rounded-lg border border-rose-900/40 text-rose-400 hover:bg-rose-950/40 transition cursor-pointer"
                                            title="Delete Project"
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

            {/* Edit Project Modal Only */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <h2 className="text-base font-bold text-white flex items-center gap-2">
                                <Pencil className="w-4 h-4 text-yellow-400" />
                                <span>Edit Project Portfolio Item</span>
                            </h2>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateProject} className="space-y-3.5 text-xs">
                            <div>
                                <label className="block text-slate-300 font-semibold mb-1">Project Title *</label>
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
                                    <label className="block text-slate-300 font-semibold mb-1">Category *</label>
                                    <input
                                        type="text"
                                        required
                                        list="edit-category-suggestions"
                                        value={editFormData.category}
                                        onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-yellow-400"
                                    />
                                    <datalist id="edit-category-suggestions">
                                        {COMMON_CATEGORIES.map((cat) => (
                                            <option key={cat} value={cat} />
                                        ))}
                                    </datalist>
                                </div>
                                <div>
                                    <label className="block text-slate-300 font-semibold mb-1">Location *</label>
                                    <input
                                        type="text"
                                        required
                                        value={editFormData.location}
                                        onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-yellow-400"
                                    />
                                </div>
                            </div>

                            {/* Project Image Section in Edit Modal */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="block text-slate-300 font-semibold">Cover Image</label>
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
                                        <div className="flex items-center gap-3 p-2 bg-slate-950 rounded-xl border border-slate-800">
                                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-900 shrink-0">
                                                <img
                                                    src={editImagePreview || resolveImageSrc(editFormData.currentImage)}
                                                    alt="Project thumbnail"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="grow min-w-0">
                                                <p className="text-white font-medium truncate text-xs">
                                                    {editImageFile ? editImageFile.name : 'Current Cover Photo'}
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
                                        placeholder="e.g. projects/project-photo.webp or full Supabase URL"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-yellow-400 font-mono text-xs"
                                    />
                                )}
                            </div>

                            <div>
                                <label className="block text-slate-300 font-semibold mb-1">Short Description</label>
                                <textarea
                                    rows={2}
                                    value={editFormData.description}
                                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-yellow-400 resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-300 font-semibold mb-1">Long Description (Optional)</label>
                                <textarea
                                    rows={3}
                                    value={editFormData.longDescription}
                                    onChange={(e) => setEditFormData({ ...editFormData, longDescription: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-yellow-400 text-xs"
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
                                        id="editProjectPublished"
                                        checked={editFormData.published}
                                        onChange={(e) => setEditFormData({ ...editFormData, published: e.target.checked })}
                                        className="rounded border-slate-700 bg-slate-950 text-yellow-400 focus:ring-yellow-400"
                                    />
                                    <label htmlFor="editProjectPublished" className="text-slate-300 font-semibold cursor-pointer">
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
                                            <span>Updating Project...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            <span>Update Project</span>
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
