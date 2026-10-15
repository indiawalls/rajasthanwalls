'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { uploadProduct } from '@/lib/api/products';

const initialFormData = {
    title: '',
    type: '',
    location: '',
    description: '',
    longDescription: '',
};

export default function FormPanelPage() {
    const [formData, setFormData] = useState(initialFormData);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [galleryFiles, setGalleryFiles] = useState([]);
    const [galleryPreviews, setGalleryPreviews] = useState([]);
    const [state, setState] = useState({
        error: '',
        success: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const imageInputRef = useRef(null);
    const galleryInputRef = useRef(null);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((currentData) => ({ ...currentData, [name]: value }));
    };

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (imagePreview && imagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(imagePreview);
        }
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleGalleryChange = (event) => {
        const files = Array.from(event.target.files || []);
        galleryPreviews.forEach((url) => {
            if (url && url.startsWith('blob:')) URL.revokeObjectURL(url);
        });
        setGalleryFiles(files);
        setGalleryPreviews(files.map((file) => URL.createObjectURL(file)));
    };

    const resetForm = () => {
        if (imagePreview && imagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(imagePreview);
        }
        galleryPreviews.forEach((url) => {
            if (url && url.startsWith('blob:')) URL.revokeObjectURL(url);
        });

        setFormData(initialFormData);
        setImageFile(null);
        setImagePreview('');
        setGalleryFiles([]);
        setGalleryPreviews([]);

        if (imageInputRef.current) {
            imageInputRef.current.value = '';
        }
        if (galleryInputRef.current) {
            galleryInputRef.current.value = '';
        }
    };

    useEffect(() => {
        return () => {
            if (imagePreview && imagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
            galleryPreviews.forEach((url) => {
                if (url && url.startsWith('blob:')) URL.revokeObjectURL(url);
            });
        };
    }, [imagePreview, galleryPreviews]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setState({ error: '', success: false });
        setIsSubmitting(true);

        const uploadData = new FormData();
        uploadData.append('title', formData.title);
        uploadData.append('type', formData.type);
        uploadData.append('location', formData.location);
        uploadData.append('description', formData.description);
        uploadData.append('longDescription', formData.longDescription);
        uploadData.append('image', imageFile);
        galleryFiles.forEach((file) => uploadData.append('gallery', file));

        try {
            await uploadProduct(uploadData);
            resetForm();
            setState({ error: '', success: true });
        } catch (requestError) {
            setState({
                error: requestError.response?.data?.error || 'Upload failed. Please try again.',
                success: false,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        return () => {
            if (imagePreview) URL.revokeObjectURL(imagePreview);
        };
    }, [imagePreview]);

    useEffect(() => {
        return () => {
            galleryPreviews.forEach((preview) => URL.revokeObjectURL(preview));
        };
    }, [galleryPreviews]);

    return (
        <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100 sm:px-6">
            <div className="mx-auto max-w-2xl">
                <div className="mb-6">
                    <Link
                        href="/admin/dashboard"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-yellow-400 transition mb-4"
                    >
                        <span>← Back to Admin Dashboard</span>
                    </Link>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400">
                        Portfolio Uploader
                    </p>
                    <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight">
                        Upload New Project
                    </h1>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8"
                >
                    {state.error && (
                        <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400" role="alert">
                            {state.error}
                        </p>
                    )}

                    <label className="block text-sm font-medium text-slate-300">
                        Title
                        <input
                            name="title"
                            type="text"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-yellow-500"
                        />
                    </label>

                    <label className="block text-sm font-medium text-slate-300">
                        Type
                        <input
                            name="type"
                            type="text"
                            required
                            value={formData.type}
                            onChange={handleChange}
                            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-yellow-500"
                        />
                    </label>

                    <label className="block text-sm font-medium text-slate-300">
                        Location
                        <input
                            name="location"
                            type="text"
                            required
                            value={formData.location}
                            onChange={handleChange}
                            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-yellow-500"
                        />
                    </label>

                    <label className="block text-sm font-medium text-slate-300">
                        Description
                        <textarea
                            name="description"
                            rows="5"
                            required
                            value={formData.description}
                            onChange={handleChange}
                            className="mt-2 w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-yellow-500"
                        />
                    </label>

                    <label className="block text-sm font-medium text-slate-300">
                        Project description detail
                        <textarea
                            name="longDescription"
                            rows="6"
                            value={formData.longDescription}
                            onChange={handleChange}
                            className="mt-2 w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-yellow-500"
                        />
                    </label>

                    <label className="block text-sm font-medium text-slate-300">
                        Project image
                        <input
                            name="image"
                            type="file"
                            accept="image/*"
                            required
                            ref={imageInputRef}
                            onChange={handleImageChange}
                            className="mt-2 block w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-yellow-600 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-yellow-500"
                        />
                    </label>

                    {imagePreview && (
                        <div className="overflow-hidden rounded-xl border border-slate-700">
                            <img
                                src={imagePreview}
                                alt={imageFile?.name || 'Selected product preview'}
                                className="h-48 w-full object-cover"
                            />
                        </div>
                    )}

                    <label className="block text-sm font-medium text-slate-300">
                        Project gallery
                        <input
                            name="gallery"
                            type="file"
                            accept="image/*"
                            multiple
                            ref={galleryInputRef}
                            onChange={handleGalleryChange}
                            className="mt-2 block w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-yellow-600 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-yellow-500"
                        />
                    </label>

                    {galleryPreviews.length > 0 && (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {galleryPreviews.map((preview, index) => (
                                <img
                                    key={preview}
                                    src={preview}
                                    alt={`Project gallery preview ${index + 1}: ${galleryFiles[index]?.name || ''}`}
                                    className="h-32 w-full rounded-lg object-cover"
                                />
                            ))}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-xl bg-yellow-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-yellow-500 sm:w-auto"
                    >
                        {isSubmitting ? 'Uploading...' : 'Save project'}
                    </button>

                    {state.success && (
                        <p className="text-sm text-emerald-400" role="status">
                            Project submitted successfully.
                        </p>
                    )}
                </form>
            </div>
        </main>
    );
}