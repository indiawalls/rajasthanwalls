'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Sliders,
    Phone,
    MessageCircle,
    Mail,
    MapPin,
    Clock,
    CheckCircle2,
    Loader2,
    X,
    Building2,
    Save,
} from 'lucide-react';

export default function SiteSettingsAdminPage() {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [feedback, setFeedback] = useState({ text: '', type: '' });

    const [contactInfo, setContactInfo] = useState({
        phone: '+91 9950711475',
        whatsapp: '917820879777',
        email: 'info@rajasthanwall.com',
        plantAddress: 'Near Gyan Sagar, Alampur, Kotkasim, Rajasthan',
        headOffice: 'C7, Shri Hari Laxmi Tower, Bhagat Singh Circle, Alwar',
        googleMapsEmbed:
            'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d905431.5347039085!2d75.98906689793341!3d27.567415731693576!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d4d5b6dd506d5%3A0xa2d556086c32334c!2sVR%20ENTERPRISES!5e0!3m2!1sen!2sin!4v1789200071199!5m2!1sen!2sin',
    });

    function handleMapInput(value) {
        let cleanUrl = value.trim();
        // If user pastes full iframe like <iframe src="https://..."></iframe>
        const match = cleanUrl.match(/src=["']([^"']+)["']/i);
        if (match && match[1]) {
            cleanUrl = match[1];
        }
        // If user pastes a plain google search/place query without embed
        if ((cleanUrl.startsWith('https://www.google.com/maps?') || cleanUrl.startsWith('https://maps.google.com/?')) && !cleanUrl.includes('/embed')) {
            if (!cleanUrl.includes('output=embed')) {
                cleanUrl += (cleanUrl.includes('?') ? '&' : '?') + 'output=embed';
            }
        }
        setContactInfo({ ...contactInfo, googleMapsEmbed: cleanUrl });
    }

    const [businessHours, setBusinessHours] = useState({
        weekdays: '9:00 AM – 7:00 PM',
        sunday: 'Site Visits by Appointment',
    });

    useEffect(() => {
        fetch('/api/admin/settings')
            .then((r) => r.json())
            .then((res) => {
                if (res.success && res.settings) {
                    const cDoc = res.settings.find((s) => s.key === 'contact_info');
                    if (cDoc?.value) setContactInfo((prev) => ({ ...prev, ...cDoc.value }));

                    const bDoc = res.settings.find((s) => s.key === 'business_hours');
                    if (bDoc?.value) setBusinessHours((prev) => ({ ...prev, ...bDoc.value }));
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    async function handleSaveSettings(e) {
        e.preventDefault();
        setSubmitting(true);
        setFeedback({ text: '', type: '' });

        try {
            // Save contact info
            const res1 = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    key: 'contact_info',
                    value: contactInfo,
                    description: 'Primary business contacts and manufacturing locations',
                }),
            });

            // Save business hours
            const res2 = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    key: 'business_hours',
                    value: businessHours,
                    description: 'Dispatch and customer service timings',
                }),
            });

            const d1 = await res1.json();
            const d2 = await res2.json();

            if (d1.success && d2.success) {
                setFeedback({ text: 'Site settings updated successfully!', type: 'success' });
            } else {
                setFeedback({ text: d1.error || d2.error || 'Failed to save settings', type: 'error' });
            }
        } catch (err) {
            setFeedback({ text: 'Error saving settings', type: 'error' });
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24 text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin text-yellow-400 mr-2" />
                <span className="text-xs">Loading site configurations...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Header */}
            <div>
                <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <Sliders className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 shrink-0" />
                    <span>Site Settings</span>
                </h1>
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

            {/* 10 Factory Units Explorer Banner */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-950 border border-yellow-400/30 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white">Homepage Manufacturing Sites & Interactive Map Units</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Manage all 10 factory units, pin coordinates, and individual Google Maps links.</p>
                    </div>
                </div>
                <Link
                    href="/admin/dashboard/units"
                    className="inline-flex items-center justify-center gap-1.5 bg-yellow-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl hover:bg-yellow-300 transition text-xs shrink-0 shadow-md"
                >
                    <span>Manage Units</span>
                    <span>→</span>
                </Link>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6">
                {/* Contact Information Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
                    <h2 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
                        <Phone className="w-4 h-4 text-yellow-400" />
                        <span>Direct Communication Channels</span>
                    </h2>

                    <div className="grid sm:grid-cols-2 gap-4 text-xs">
                        <div>
                            <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5 text-slate-400" />
                                <span>Official Calling Number *</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={contactInfo.phone}
                                onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-yellow-400 font-mono"
                            />
                        </div>

                        <div>
                            <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                                <span>WhatsApp Number (Country Code + Number) *</span>
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="917820879777"
                                value={contactInfo.whatsapp}
                                onChange={(e) => setContactInfo({ ...contactInfo, whatsapp: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-yellow-400 font-mono"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-yellow-400" />
                                <span>Official Inquiry Email *</span>
                            </label>
                            <input
                                type="email"
                                required
                                value={contactInfo.email}
                                onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-yellow-400 font-mono"
                            />
                        </div>
                    </div>
                </div>

                {/* Locations Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
                    <h2 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
                        <MapPin className="w-4 h-4 text-yellow-400" />
                        <span>Factory Unit & Corporate Office</span>
                    </h2>

                    <div className="space-y-4 text-xs">
                        <div>
                            <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                <span>Primary Manufacturing Plant Address *</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={contactInfo.plantAddress}
                                onChange={(e) => setContactInfo({ ...contactInfo, plantAddress: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-yellow-400"
                            />
                        </div>

                        <div>
                            <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                <span>Corporate Head Office Address *</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={contactInfo.headOffice}
                                onChange={(e) => setContactInfo({ ...contactInfo, headOffice: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-yellow-400"
                            />
                        </div>
                    </div>
                </div>

                {/* Google Maps Embed Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <h2 className="text-sm font-bold text-white flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-yellow-400" />
                            <span>Google Maps Embed Location</span>
                        </h2>
                        <a
                            href="https://www.google.com/maps"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-yellow-400 hover:underline flex items-center gap-1"
                        >
                            Open Google Maps
                        </a>
                    </div>

                    <div className="space-y-3 text-xs">
                        <div>
                            <label className="block text-slate-300 font-semibold mb-1">
                                Google Maps Embed URL or iframe code
                            </label>
                            <textarea
                                rows={3}
                                value={contactInfo.googleMapsEmbed || ''}
                                onChange={(e) => handleMapInput(e.target.value)}
                                placeholder='Paste embed link or <iframe src="https://www.google.com/maps/embed?..."></iframe>'
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono text-[11px] focus:outline-hidden focus:border-yellow-400"
                            />

                            {(contactInfo.googleMapsEmbed?.includes('maps.app.goo.gl') || contactInfo.googleMapsEmbed?.includes('goo.gl/maps')) && (
                                <div className="p-2.5 rounded-lg bg-amber-950/50 border border-amber-800/80 text-amber-300 text-[11px] leading-relaxed">
                                    ⚠️ <strong>Short link detected:</strong> Google does not allow short URLs (maps.app.goo.gl) inside website iframes. Please open the link in browser, click <strong>Share ➜ Embed a map</strong>, and paste the HTML or iframe embed link here.
                                </div>
                            )}

                            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                                <span>💡 <strong>Tip:</strong> Google Maps ➜ Search Location ➜ Share ➜ <strong>Embed a map</strong> ➜ Copy link/iframe.</span>
                                <button
                                    type="button"
                                    onClick={() => handleMapInput('https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d905431.5347039085!2d75.98906689793341!3d27.567415731693576!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d4d5b6dd506d5%3A0xa2d556086c32334c!2sVR%20ENTERPRISES!5e0!3m2!1sen!2sin!4v1789200071199!5m2!1sen!2sin')}
                                    className="text-yellow-400 hover:underline shrink-0 ml-2"
                                >
                                    Reset to VR Enterprises
                                </button>
                            </div>
                        </div>

                        {contactInfo.googleMapsEmbed && (
                            <div className="space-y-1.5 pt-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-semibold text-slate-400">Live Map Preview:</span>
                                    <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                                        ✓ Live Preview Active
                                    </span>
                                </div>
                                <div className="w-full h-52 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner">
                                    <iframe
                                        src={contactInfo.googleMapsEmbed}
                                        width="100%"
                                        height="100%"
                                        loading="lazy"
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        className="border-0"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Operating Timings */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
                    <h2 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
                        <Clock className="w-4 h-4 text-yellow-400" />
                        <span>Operating & Dispatch Timings</span>
                    </h2>

                    <div className="grid sm:grid-cols-2 gap-4 text-xs">
                        <div>
                            <label className="block text-slate-300 font-semibold mb-1">Monday – Saturday Timings</label>
                            <input
                                type="text"
                                value={businessHours.weekdays}
                                onChange={(e) => setBusinessHours({ ...businessHours, weekdays: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-yellow-400"
                            />
                        </div>

                        <div>
                            <label className="block text-slate-300 font-semibold mb-1">Sunday / Holiday Schedule</label>
                            <input
                                type="text"
                                value={businessHours.sunday}
                                onChange={(e) => setBusinessHours({ ...businessHours, sunday: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-yellow-400"
                            />
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex items-center justify-end">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-lg shadow-yellow-400/10 cursor-pointer disabled:opacity-50"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Saving Changes...</span>
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                <span>Save All Settings</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
