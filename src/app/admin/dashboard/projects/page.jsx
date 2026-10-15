'use client';

import { useState, useEffect } from 'react';
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
    Layers,
} from 'lucide-react';

export default function ProjectsAdminPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

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

    async function handleDelete(id) {
        if (!confirm('Are you sure you want to delete this project? This will also remove the cover photo from Supabase storage.')) return;
        try {
            const res = await fetch(`/api/admin/projects?id=${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                setProjects((prev) => prev.filter((p) => p._id !== id));
            }
        } catch (err) {
            console.error('Failed to delete project:', err);
        }
    }

    const imagePrefix = process.env.NEXT_PUBLIC_IMAGES || '';

    return (
        <div className="space-y-6">
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

            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
                </div>
            ) : projects.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
                    No projects found. Click "Upload New Project" to add your first portfolio item.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {projects.map((proj) => {
                        const imgUrl = proj.image?.startsWith('http')
                            ? proj.image
                            : `${imagePrefix}/${proj.image?.replace(/^\/+/, '')}`;

                        return (
                            <div
                                key={proj._id}
                                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-slate-700 transition group"
                            >
                                <div>
                                    <div className="relative aspect-video bg-slate-950 overflow-hidden">
                                        {proj.image ? (
                                            <Image
                                                src={imgUrl}
                                                alt={proj.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">
                                                No Image
                                            </div>
                                        )}
                                        <span className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur text-yellow-300 text-[10px] font-bold px-2 py-0.5 rounded">
                                            {proj.category || 'Boundary Wall'}
                                        </span>
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

                                <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-800/80 mt-2">
                                    <button
                                        type="button"
                                        onClick={() => handleTogglePublish(proj._id, proj.published)}
                                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer transition ${
                                            proj.published
                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                                        }`}
                                    >
                                        {proj.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                        <span>{proj.published ? 'Live' : 'Hidden'}</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleDelete(proj._id)}
                                        className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
                                        title="Delete Project"
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
