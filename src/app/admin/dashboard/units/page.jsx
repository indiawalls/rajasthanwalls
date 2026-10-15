'use client';

import { useState, useEffect } from 'react';
import {
    MapPin,
    Plus,
    Trash2,
    Edit2,
    Save,
    RotateCcw,
    ExternalLink,
    ChevronUp,
    ChevronDown,
    Loader2,
    CheckCircle2,
    AlertCircle,
    X,
    Building2,
    Globe,
    Navigation,
} from 'lucide-react';

export default function ManufacturingUnitsAdminPage() {
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [feedback, setFeedback] = useState({ text: '', type: '' });

    // Modal state for Add/Edit
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null); // null = Add, number = Edit
    const [formData, setFormData] = useState({
        city: '',
        region: 'Rajasthan',
        address: '',
        lat: '',
        lng: '',
        mapsUrl: '',
    });

    useEffect(() => {
        fetchUnits();
    }, []);

    async function fetchUnits() {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/units');
            const data = await res.json();
            if (data.success && Array.isArray(data.units)) {
                setUnits(data.units);
            }
        } catch {
            setFeedback({ text: 'Failed to load units from server.', type: 'error' });
        } finally {
            setLoading(false);
        }
    }

    async function saveAllUnits(updatedUnits) {
        setSaving(true);
        setFeedback({ text: '', type: '' });
        try {
            const res = await fetch('/api/admin/units', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ units: updatedUnits }),
            });
            const data = await res.json();
            if (data.success) {
                setUnits(data.units);
                setFeedback({ text: 'Manufacturing units updated successfully!', type: 'success' });
            } else {
                setFeedback({ text: data.error || 'Failed to save units.', type: 'error' });
            }
        } catch {
            setFeedback({ text: 'Error saving units.', type: 'error' });
        } finally {
            setSaving(false);
        }
    }

    function openAddModal() {
        setEditingIndex(null);
        setFormData({
            city: '',
            region: 'Rajasthan',
            address: '',
            lat: '27.500',
            lng: '76.500',
            mapsUrl: '',
        });
        setIsModalOpen(true);
    }

    function openEditModal(index) {
        setEditingIndex(index);
        const u = units[index];
        setFormData({
            city: u.city || '',
            region: u.region || 'Rajasthan',
            address: u.address || '',
            lat: u.lat?.toString() || '',
            lng: u.lng?.toString() || '',
            mapsUrl: u.mapsUrl || '',
        });
        setIsModalOpen(true);
    }

    function handleModalSubmit(e) {
        e.preventDefault();
        const latNum = parseFloat(formData.lat);
        const lngNum = parseFloat(formData.lng);

        let finalUrl = formData.mapsUrl.trim();
        if (!finalUrl && !isNaN(latNum) && !isNaN(lngNum)) {
            finalUrl = `https://maps.google.com/?q=${latNum},${lngNum}`;
        }

        const newUnit = {
            city: formData.city.trim(),
            region: formData.region.trim(),
            address: formData.address.trim(),
            lat: isNaN(latNum) ? 27.5 : latNum,
            lng: isNaN(lngNum) ? 76.5 : lngNum,
            mapsUrl: finalUrl,
        };

        let updatedList;
        if (editingIndex === null) {
            // Add
            updatedList = [...units, newUnit];
        } else {
            // Update
            updatedList = [...units];
            updatedList[editingIndex] = newUnit;
        }

        setIsModalOpen(false);
        saveAllUnits(updatedList);
    }

    function handleDelete(index) {
        const u = units[index];
        if (confirm(`Are you sure you want to delete "${u.city}"?`)) {
            const updated = units.filter((_, i) => i !== index);
            saveAllUnits(updated);
        }
    }

    function moveUp(index) {
        if (index === 0) return;
        const copy = [...units];
        const temp = copy[index - 1];
        copy[index - 1] = copy[index];
        copy[index] = temp;
        saveAllUnits(copy);
    }

    function moveDown(index) {
        if (index === units.length - 1) return;
        const copy = [...units];
        const temp = copy[index + 1];
        copy[index + 1] = copy[index];
        copy[index] = temp;
        saveAllUnits(copy);
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24 text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin text-yellow-400 mr-2" />
                <span className="text-xs">Loading manufacturing units...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl">
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
                <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 shrink-0" />
                    <span>Manufacturing Units</span>
                    <span className="bg-yellow-400/20 text-yellow-400 text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-bold border border-yellow-400/30">
                        {units.length}
                    </span>
                </h1>

                <button
                    type="button"
                    onClick={openAddModal}
                    className="inline-flex items-center justify-center gap-1.5 bg-yellow-400 text-slate-950 font-bold px-3.5 py-2 rounded-xl hover:bg-yellow-300 transition text-xs shadow-md shrink-0"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Unit</span>
                </button>
            </div>

            {/* Feedback Alert */}
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

            {/* Units List */}
            <div className="space-y-3">
                {units.map((unit, index) => (
                    <div
                        key={index}
                        className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4.5 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition shadow-sm"
                    >
                        {/* Info */}
                        <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex items-center gap-2.5 flex-wrap">
                                <span className="w-6 h-6 rounded-lg bg-yellow-400/10 text-yellow-400 font-bold text-xs flex items-center justify-center border border-yellow-400/20">
                                    {index + 1}
                                </span>
                                <h3 className="text-sm font-bold text-white truncate">{unit.city}</h3>
                                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                                    {unit.region}
                                </span>
                            </div>

                            <p className="text-xs text-slate-300 flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                <span>{unit.address || 'No address specified'}</span>
                            </p>

                            <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono">
                                <span className="flex items-center gap-1">
                                    <Navigation className="w-3 h-3 text-slate-500" />
                                    Lat: {unit.lat}, Lng: {unit.lng}
                                </span>
                                {unit.mapsUrl && (
                                    <a
                                        href={unit.mapsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-yellow-400 hover:underline flex items-center gap-1 font-sans"
                                    >
                                        <span>Test Maps Link</span>
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
                            <button
                                type="button"
                                disabled={index === 0 || saving}
                                onClick={() => moveUp(index)}
                                title="Move Up"
                                className="p-2 rounded-lg bg-slate-950 text-slate-400 hover:text-white disabled:opacity-30 border border-slate-800"
                            >
                                <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                                type="button"
                                disabled={index === units.length - 1 || saving}
                                onClick={() => moveDown(index)}
                                title="Move Down"
                                className="p-2 rounded-lg bg-slate-950 text-slate-400 hover:text-white disabled:opacity-30 border border-slate-800"
                            >
                                <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => openEditModal(index)}
                                title="Edit Unit"
                                className="inline-flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition border border-slate-700"
                            >
                                <Edit2 className="w-3.5 h-3.5 text-yellow-400" />
                                <span>Edit</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDelete(index)}
                                title="Delete Unit"
                                className="p-2 rounded-lg bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 border border-rose-800/60 transition"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal for Add / Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                            <h2 className="text-base font-bold text-white flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-yellow-400" />
                                <span>{editingIndex === null ? 'Add New Manufacturing Unit' : 'Edit Manufacturing Unit'}</span>
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleModalSubmit} className="space-y-4 text-xs">
                            <div>
                                <label className="block text-slate-300 font-semibold mb-1">
                                    Unit Name / Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Kotkasim Unit"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-white focus:outline-hidden focus:border-yellow-400"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-slate-300 font-semibold mb-1">
                                        State / Region *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Rajasthan"
                                        value={formData.region}
                                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-white focus:outline-hidden focus:border-yellow-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-300 font-semibold mb-1">
                                        Industrial Area / Address *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Kotkasim industrial area"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-white focus:outline-hidden focus:border-yellow-400"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                                <div>
                                    <label className="block text-slate-300 font-semibold mb-1 font-sans">
                                        Latitude (Map Pin) *
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        required
                                        placeholder="27.70"
                                        value={formData.lat}
                                        onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-white focus:outline-hidden focus:border-yellow-400 text-xs"
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-300 font-semibold mb-1 font-sans">
                                        Longitude (Map Pin) *
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        required
                                        placeholder="76.63"
                                        value={formData.lng}
                                        onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-white focus:outline-hidden focus:border-yellow-400 text-xs"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-300 font-semibold mb-1">
                                    Google Maps Link (for "Open in Google Maps" button)
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://maps.google.com/?q=Kotkasim,Rajasthan"
                                    value={formData.mapsUrl}
                                    onChange={(e) => setFormData({ ...formData, mapsUrl: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-white font-mono text-[11px] focus:outline-hidden focus:border-yellow-400"
                                />
                                <p className="text-[11px] text-slate-500 mt-1">
                                    💡 Tip: Search location on Google Maps ➜ Click <strong>Share</strong> ➜ <strong>Copy link</strong> and paste here.
                                </p>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition text-xs"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="inline-flex items-center gap-2 bg-yellow-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl hover:bg-yellow-300 transition text-xs shadow-md"
                                >
                                    {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                    <span>{editingIndex === null ? 'Create Unit' : 'Save Changes'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
