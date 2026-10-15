'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, KeyRound, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function MfaResetPage() {
    const [otp, setOtp] = useState('');
    const [status, setStatus] = useState({ loading: false, error: '', success: false });
    const [resendStatus, setResendStatus] = useState({ loading: false, message: '' });
    const [isCancelling, setIsCancelling] = useState(false);
    const router = useRouter();
    const autoSentRef = useRef(false);

    const handleBackToLogin = async () => {
        setIsCancelling(true);
        try {
            await fetch('/api/admin/logout', { method: 'POST' });
        } catch {
            // ignore
        }
        window.location.href = '/admin';
    };

    async function handleVerify(e) {
        e.preventDefault();
        setStatus({ loading: true, error: '', success: false });

        try {
            const res = await fetch('/api/auth/mfa/reset-verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ otp }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Failed to verify OTP.');
            }

            setStatus({ loading: false, error: '', success: true });
            setTimeout(() => {
                window.location.replace(data.redirectTo || '/mfa/setup');
            }, 1200);
        } catch (err) {
            setStatus({ loading: false, error: err.message, success: false });
        }
    }

    async function handleResendOtp() {
        setResendStatus({ loading: true, message: 'Sending OTP code...' });
        try {
            const res = await fetch('/api/auth/mfa/reset-request', { method: 'POST' });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Could not send OTP.');
            setResendStatus({ loading: false, message: data.message || 'Verification code sent to your registered email.' });
        } catch (err) {
            setResendStatus({ loading: false, message: err.message });
        }
    }

    useEffect(() => {
        if (!autoSentRef.current) {
            autoSentRef.current = true;
            handleResendOtp();
        }
    }, []);

    return (
        <main className="min-h-screen w-full bg-slate-950 flex flex-col justify-center items-center px-4 relative">
            <button
                type="button"
                onClick={handleBackToLogin}
                disabled={isCancelling}
                className="absolute top-8 left-8 flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition cursor-pointer disabled:opacity-50"
            >
                {isCancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowLeft className="w-4 h-4" />}
                Back to Login
            </button>

            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
                <div className="mb-6 text-center space-y-2">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4">
                        <ShieldAlert className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        Reset Authenticator (MFA)
                    </h1>
                    <p className="text-xs text-slate-400">
                        Enter the 6-digit Emergency OTP sent to your admin email address.
                    </p>
                </div>

                {status.error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
                        {status.error}
                    </div>
                )}

                {status.success ? (
                    <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                        <p className="text-sm font-medium text-emerald-300">
                            Old Authenticator Removed!
                        </p>
                        <p className="text-xs text-slate-400">
                            Redirecting to setup a fresh QR code...
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleVerify} className="space-y-5">
                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-2">
                                6-Digit Email OTP
                            </label>
                            <input
                                type="text"
                                required
                                maxLength={6}
                                inputMode="numeric"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                placeholder="123456"
                                className="w-full text-center tracking-widest text-lg font-mono bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-yellow-500/50 transition"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status.loading || otp.length !== 6}
                            className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-slate-950 font-semibold rounded-xl py-2.5 text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-yellow-400/10"
                        >
                            {status.loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Verifying OTP...</span>
                                </>
                            ) : (
                                'Verify & Reset Authenticator'
                            )}
                        </button>

                        <div className="pt-2 text-center">
                            <button
                                type="button"
                                onClick={handleResendOtp}
                                disabled={resendStatus.loading}
                                className="text-xs text-yellow-400/80 hover:text-yellow-300 transition underline underline-offset-4 cursor-pointer"
                            >
                                {resendStatus.loading ? 'Generating new OTP...' : 'Resend Emergency OTP'}
                            </button>
                            {resendStatus.message && (
                                <p className="text-[11px] text-slate-400 mt-2">
                                    {resendStatus.message}
                                </p>
                            )}
                        </div>
                    </form>
                )}
            </div>
        </main>
    );
}
