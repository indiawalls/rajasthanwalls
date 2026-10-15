'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { QrCode, ShieldCheck, Loader2, ArrowLeft, Copy, Check, KeyRound } from 'lucide-react';
import Link from 'next/link';

function MfaSetup() {
    const router = useRouter();

    const [factorId, setFactorId] = useState('');
    const [qrCode, setQrCode] = useState('');
    const [secret, setSecret] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const started = useRef(false);

    const handleBackToLogin = async () => {
        setIsCancelling(true);
        try {
            await fetch('/api/admin/logout', { method: 'POST' });
        } catch {
            // ignore
        }
        window.location.href = '/admin';
    };

    useEffect(() => {
        if (started.current) return;
        started.current = true;
        (async () => {
            try {
                const res = await axios.post('/api/auth/mfa/enroll');
                setFactorId(res.data.factorId);
                setQrCode(res.data.qrCode);
                setSecret(res.data.secret);
            } catch (e) {
                setError(e.response?.data?.error || 'Could not start 2FA setup. Please try again.');
            }
        })();
    }, []);

    const handleCopySecret = () => {
        if (!secret) return;
        navigator.clipboard.writeText(secret);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await axios.post('/api/auth/mfa/verify', { factorId, code });
            if (res.data.ok === true) {
                window.location.replace('/admin/dashboard');
            }
        } catch (e) {
            setError(e.response?.data?.error || 'Invalid code. Try again.');
            setCode('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen w-full bg-slate-950 flex flex-col justify-center items-center px-4 py-12 relative font-sans text-slate-100">
            <button
                type="button"
                onClick={handleBackToLogin}
                disabled={isCancelling}
                className="absolute top-8 left-8 flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition cursor-pointer disabled:opacity-50"
            >
                {isCancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowLeft className="w-4 h-4" />}
                Back to Login
            </button>

            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
                {/* Header Icon & Title */}
                <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 flex items-center justify-center mx-auto mb-3">
                        <QrCode className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        Set Up Two-Factor Authentication
                    </h1>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Scan this QR code with <strong>Google Authenticator</strong> or your preferred 2FA app, then enter the 6-digit code.
                    </p>
                </div>

                {error && (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs text-center font-medium">
                        {error}
                    </div>
                )}

                {/* QR Code Container */}
                <div className="flex flex-col items-center justify-center">
                    {qrCode ? (
                        <div className="bg-white p-3.5 rounded-2xl shadow-lg border-2 border-yellow-400/40 inline-block">
                            <img
                                src={qrCode}
                                alt="Authenticator QR Code"
                                width={180}
                                height={180}
                                className="block rounded-lg"
                            />
                        </div>
                    ) : (
                        <div className="w-48 h-48 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-500 gap-2">
                            <Loader2 className="w-6 h-6 animate-spin text-yellow-400" />
                            <span className="text-xs">Generating secure QR code...</span>
                        </div>
                    )}
                </div>

                {/* Manual Secret Key */}
                {secret && (
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1.5 text-xs">
                        <span className="text-[11px] text-slate-400 font-medium block">
                            Can't scan? Enter key manually:
                        </span>
                        <div className="flex items-center justify-between gap-2">
                            <code className="text-yellow-300 font-mono tracking-wider text-[11px] select-all break-all">
                                {secret}
                            </code>
                            <button
                                type="button"
                                onClick={handleCopySecret}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition shrink-0 cursor-pointer flex items-center gap-1"
                                title="Copy secret key"
                            >
                                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                        </div>
                    </div>
                )}

                {/* Verification Form */}
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5 text-center">
                            Enter 6-Digit Authenticator Code
                        </label>
                        <input
                            type="text"
                            required
                            maxLength={6}
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                            placeholder="000000"
                            className="w-full text-center tracking-widest text-xl font-mono font-bold bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-hidden focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !factorId || code.length !== 6}
                        className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-slate-950 font-bold rounded-xl py-3 text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-yellow-400/10 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Verifying & Setting Up...</span>
                            </>
                        ) : (
                            <>
                                <ShieldCheck className="w-4 h-4" />
                                <span>Verify & Finish Setup</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </main>
    );
}

export default function Page() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
                Loading security setup...
            </div>
        }>
            <MfaSetup />
        </Suspense>
    );
}