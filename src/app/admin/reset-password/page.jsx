'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Lock, CheckCircle2, AlertCircle, Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const token = searchParams.get('token') || '';
    const email = searchParams.get('email') || '';

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [status, setStatus] = useState({ loading: false, error: '', success: false });

    async function handleReset(e) {
        e.preventDefault();
        setStatus({ loading: true, error: '', success: false });

        if (newPassword.length < 8) {
            setStatus({ loading: false, error: 'Password must be at least 8 characters.', success: false });
            return;
        }

        if (newPassword !== confirmPassword) {
            setStatus({ loading: false, error: 'Passwords do not match.', success: false });
            return;
        }

        try {
            const res = await fetch('/api/auth/password-reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, token, newPassword }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to reset password.');
            }

            setStatus({ loading: false, error: '', success: true });
            setTimeout(() => {
                router.push('/admin');
            }, 2500);
        } catch (err) {
            setStatus({ loading: false, error: err.message, success: false });
        }
    }

    if (!token || !email) {
        return (
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center space-y-5">
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                    <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-white tracking-tight">
                        Security Token Required
                    </h1>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        Direct password reset without a verified, cryptographically signed token is strictly prohibited.
                    </p>
                </div>
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-left text-xs text-slate-400 space-y-1.5">
                    <p className="font-semibold text-slate-300">Protected Recovery Protocol:</p>
                    <p>
                        A valid one-time cryptographic token with 15-minute expiry is required. Any unauthorized attempt without a token is rejected by the server.
                    </p>
                </div>
                <Link
                    href="/admin"
                    className="block w-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition"
                >
                    Return to Admin Login
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
            <div className="mb-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                    Reset Admin Password
                </h1>
            </div>

            {status.error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{status.error}</span>
                </div>
            )}

            {status.success ? (
                <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                    <p className="text-sm font-medium text-emerald-300">
                        Password updated successfully!
                    </p>
                    <p className="text-xs text-slate-400">
                        Redirecting to admin login screen...
                    </p>
                </div>
            ) : (
                <form onSubmit={handleReset} className="space-y-5">
                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-2">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                required
                                minLength={8}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="At least 8 characters"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 pr-11 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-yellow-500/50 transition"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition"
                                tabIndex={-1}
                                aria-label={showNewPassword ? "Hide password" : "Show password"}
                            >
                                {showNewPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-2">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                required
                                minLength={8}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Re-enter your new password"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 pr-11 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-yellow-500/50 transition"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition"
                                tabIndex={-1}
                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={status.loading || !token}
                        className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-slate-950 font-semibold rounded-xl py-2.5 text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-yellow-400/10"
                    >
                        {status.loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Updating Password...</span>
                            </>
                        ) : (
                            'Set New Password & Unlock'
                        )}
                    </button>
                </form>
            )}
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen w-full bg-slate-950 flex flex-col justify-center items-center px-4 relative">
            <Link
                href="/admin"
                className="absolute top-8 left-8 flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Admin Login
            </Link>
            <Suspense fallback={<div className="text-slate-400 text-sm">Loading security screen...</div>}>
                <ResetPasswordContent />
            </Suspense>
        </div>
    );
}
