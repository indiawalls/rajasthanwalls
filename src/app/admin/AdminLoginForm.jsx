'use client';

import { useState } from 'react';
import { Lock, Mail, Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginAdmin } from '@/lib/api/auth';

export default function AdminLoginForm({ callbackUrl }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await loginAdmin({ email, password });
            if (res.data.ok === true) {
                const callback =
                    callbackUrl?.startsWith('/') && !callbackUrl.startsWith('//')
                        ? callbackUrl
                        : '/admin/dashboard';
                const destination =
                    res.data.nextStep === 'mfa'
                        ? '/mfa'
                        : res.data.nextStep === 'mfa-setup'
                            ? '/mfa/setup'
                            : callback;
                router.push(destination);
            }

        } catch (requestError) {
            setError(requestError.response?.data?.error || 'Unable to sign in. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-full bg-slate-950 flex flex-col justify-center items-center px-4 relative">
            <Link
                href="/"
                className="absolute top-8 left-8 flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Website
            </Link>

            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
                <div className="mb-8 text-center space-y-2">
                    <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        Owner Access
                    </h1>
                </div>

                {error && (
                    <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs text-center font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-2">
                            Admin Email
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                <Mail className="w-4 h-4" />
                            </div>
                            <input
                                type="email"
                                name="email"
                                required
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="owner@rajasthanwall.com"
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-yellow-500 transition"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                <Lock className="w-4 h-4" />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                required
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="••••••••••••"
                                className="w-full pl-10 pr-11 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-yellow-500 transition"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition"
                                tabIndex={-1}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-medium text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-yellow-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Authenticating...
                            </>
                        ) : (
                            'Sign In to Dashboard'
                        )}
                    </button>
                </form>

                <p className="mt-8 text-center text-[11px] text-slate-600">
                    Restricted administrative area. Authorized personnel only.
                </p>
            </div>
        </div>
    );
}