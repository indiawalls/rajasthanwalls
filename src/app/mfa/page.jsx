'use client';

import { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Loader2, ArrowLeft, KeyRound } from 'lucide-react';
import Link from 'next/link';

function MfaVerify() {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const router = useRouter();

    const handleBackToLogin = async () => {
        setIsCancelling(true);
        try {
            await fetch('/api/admin/logout', { method: 'POST' });
        } catch {
            // ignore
        }
        window.location.href = '/admin';
    };

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/mfa/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (data?.redirectTo) {
                    router.push(data.redirectTo);
                    return;
                }
                throw new Error(data?.error || 'Invalid code. Try again.');
            }

            window.location.replace('/admin/dashboard');
        } catch (err) {
            setError(err.message || 'Invalid code. Try again.');
            setCode('');
        } finally {
            setLoading(false);
        }
    };

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

            <form
                onSubmit={submit}
                className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6"
            >
                <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        Two-Factor Authentication
                    </h1>
                    <p className="text-xs text-slate-400">
                        Enter the 6-digit verification code from your Authenticator app.
                    </p>
                </div>

                {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium">
                        {error}
                    </div>
                )}

                <div>
                    <input
                        className="w-full text-center tracking-widest text-xl font-mono bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-yellow-500/50 transition"
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                        inputMode="numeric"
                        maxLength={6}
                        autoComplete="one-time-code"
                        placeholder="000000"
                        autoFocus
                    />
                </div>

                <button
                    className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-slate-950 font-semibold rounded-xl py-2.5 text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-yellow-400/10"
                    type="submit"
                    disabled={loading || code.length !== 6}
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Verifying Code...</span>
                        </>
                    ) : (
                        'Verify & Proceed'
                    )}
                </button>

                <div className="pt-2 border-t border-slate-800/80 text-center">
                    <Link
                        href="/mfa/reset"
                        className="text-xs text-slate-400 hover:text-yellow-400 transition inline-flex items-center gap-1.5"
                    >
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Lost authenticator? Reset via Email OTP</span>
                    </Link>
                </div>
            </form>
        </main>
    );
}

export default function Page() {
    return (
        <Suspense fallback={null}>
            <MfaVerify />
        </Suspense>
    );
}