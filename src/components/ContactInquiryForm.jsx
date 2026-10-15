'use client';

import { useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle, Send } from 'lucide-react';

const precastWall = 'Precast Concrete Boundary Wall';

export default function ContactInquiryForm() {
    const [product, setProduct] = useState(precastWall);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [length, setLength] = useState('');
    const [height, setHeight] = useState('6');
    const [location, setLocation] = useState('');
    const [requirements, setRequirements] = useState('');
    const [honeypot, setHoneypot] = useState('');
    const [status, setStatus] = useState({ loading: false, error: '', success: false });

    async function handleSubmit(e) {
        e.preventDefault();
        setStatus({ loading: true, error: '', success: false });

        const dimensions = product === precastWall ? `${length ? length + ' Running Feet' : ''} (Height: ${height}ft)` : '';

        try {
            const res = await fetch('/api/inquiry/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    phone,
                    product,
                    dimensions,
                    location,
                    requirements,
                    website_hp: honeypot,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Failed to submit quote request.');
            }

            setStatus({ loading: false, error: '', success: true });
            setName('');
            setPhone('');
            setLength('');
            setLocation('');
            setRequirements('');
        } catch (err) {
            setStatus({ loading: false, error: err.message, success: false });
        }
    }

    if (status.success) {
        return (
            <div className="p-8 sm:p-12 rounded-3xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
                <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
                <h3 className="text-2xl font-bold text-slate-900">
                    Inquiry Received Successfully!
                </h3>
                <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out to Rajasthanwall Infratech. Our technical estimation team will prepare your project estimate and call you within 24 hours.
                </p>
                <button
                    type="button"
                    onClick={() => setStatus({ loading: false, error: '', success: false })}
                    className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-yellow-600 hover:text-yellow-700 bg-white border border-slate-200 px-6 py-2.5 rounded-xl shadow-sm transition"
                >
                    Submit Another Inquiry
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {status.error && (
                <div className="sm:col-span-2 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-600 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{status.error}</span>
                </div>
            )}

            {/* Honeypot Bot Trap (invisible to real human users) */}
            <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
                <input
                    type="text"
                    name="website_hp"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Your Full Name *
                </label>
                <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-yellow-500 transition"
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Phone / Mobile Number *
                </label>
                <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-yellow-500 transition"
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Product Category
                </label>
                <select
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-yellow-500 transition"
                >
                    <option>Precast Concrete Boundary Wall</option>
                    <option>RCC Fencing Poles</option>
                    <option>Chainlink Mesh Fencing</option>
                    <option>Interlocking Paver Blocks</option>
                    <option>Multiple / Turnkey Project</option>
                </select>
            </div>

            {product === precastWall && (
                <>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Approximate Area / Length (Feet)
                        </label>
                        <input
                            type="text"
                            value={length}
                            onChange={(e) => setLength(e.target.value)}
                            placeholder="e.g. 500 Running Feet"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-yellow-500 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Wall Height (Feet)
                        </label>
                        <select
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-yellow-500 transition"
                        >
                            {[5, 6, 7, 8, 9, 10].map((h) => (
                                <option key={h} value={h}>
                                    {h} Feet
                                </option>
                            ))}
                        </select>
                    </div>
                </>
            )}

            <div className={product === precastWall ? '' : 'sm:col-span-2'}>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Site Location / City
                </label>
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Alwar, Bhiwadi, Gurgaon"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-yellow-500 transition"
                />
            </div>

            <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Specific Requirements & Scope
                </label>
                <textarea
                    rows="4"
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="Share any additional requirements, ground condition, preferred installation schedule, or other project details..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-yellow-500 transition"
                ></textarea>
            </div>

            <div className="sm:col-span-2">
                <button
                    type="submit"
                    disabled={status.loading}
                    className="w-full bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 text-white font-bold py-2.5 sm:py-3 px-4 rounded-xl shadow-md transition duration-200 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                    {status.loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Submitting Quote Request...</span>
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            <span>Submit Inquiry & Get Factory Rates</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
