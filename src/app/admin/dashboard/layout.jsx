'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Inbox,
    FolderKanban,
    MessageSquareQuote,
    HelpCircle,
    FileText,
    PlusCircle,
    LogOut,
    ExternalLink,
    Menu,
    X,
    Package,
    Sliders,
    MapPin,
} from 'lucide-react';

const navItems = [
    { label: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Customer Leads', href: '/admin/dashboard/inquiries', icon: Inbox },
    { label: 'Products Catalog', href: '/admin/dashboard/products', icon: Package },
    { label: 'Projects Manager', href: '/admin/dashboard/projects', icon: FolderKanban },
    { label: 'Client Reviews', href: '/admin/dashboard/testimonials', icon: MessageSquareQuote },
    { label: 'FAQ Manager', href: '/admin/dashboard/faqs', icon: HelpCircle },
    { label: 'Blog Articles', href: '/admin/dashboard/blogs', icon: FileText },
    { label: 'Manufacturing Units', href: '/admin/dashboard/units', icon: MapPin },
    { label: 'Site Settings', href: '/admin/dashboard/settings', icon: Sliders },
    { label: 'Add New Project', href: '/admin/form-panel', icon: PlusCircle },
];

export default function AdminDashboardLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        fetch('/api/admin/me')
            .then((r) => r.json())
            .then((res) => {
                if (res.success && res.user?.email) {
                    setUserEmail(res.user.email);
                }
            })
            .catch(() => {});
    }, []);

    async function handleLogout() {
        setLoggingOut(true);
        try {
            await fetch('/api/admin/logout', { method: 'POST' });
            window.location.href = '/admin';
        } catch {
            window.location.href = '/admin';
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
            {/* Top Navigation Bar */}
            <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40 px-3.5 sm:px-6 flex items-center justify-between">
                <div className="flex items-center gap-2.5 sm:gap-3">
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                        aria-label="Toggle menu"
                    >
                        {sidebarOpen ? <X className="w-5 h-5 text-yellow-400" /> : <Menu className="w-5 h-5" />}
                    </button>
                    <Link href="/admin/dashboard" className="flex items-center gap-2">
                        <span className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                            Rajasthan<span className="text-yellow-400">Wall</span>
                        </span>
                    </Link>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 text-xs text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-700 border border-slate-700/60 p-2 sm:px-3 sm:py-2 rounded-xl transition shrink-0"
                        title="View Live Site"
                        aria-label="View Live Site"
                    >
                        <ExternalLink className="w-4 h-4 text-yellow-400" />
                        <span className="hidden sm:inline font-medium">View Live Site</span>
                    </a>

                    <button
                        type="button"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 p-2 sm:px-3 sm:py-2 rounded-xl transition cursor-pointer shrink-0"
                        title="Sign Out"
                        aria-label="Sign Out"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline font-medium">{loggingOut ? 'Signing out...' : 'Sign Out'}</span>
                    </button>
                </div>
            </header>

            <div className="flex flex-1 relative">
                {/* Mobile Backdrop Overlay */}
                {sidebarOpen && (
                    <div
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 top-16 bg-slate-950/80 backdrop-blur-xs z-30 lg:hidden"
                        aria-hidden="true"
                    />
                )}

                {/* Left Sidebar */}
                <aside
                    className={`fixed inset-y-16 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 lg:static lg:translate-x-0 ${
                        sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
                    }`}
                >
                    <div className="p-3.5 sm:p-4 space-y-1 overflow-y-auto flex-1">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3 py-2">
                            Management Portal
                        </div>
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                                        isActive
                                            ? 'bg-yellow-400 text-slate-950 font-bold shadow-lg shadow-yellow-400/10'
                                            : 'text-slate-300 hover:text-white hover:bg-slate-800'
                                    }`}
                                >
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="p-4 border-t border-slate-800/80 space-y-2.5">
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800/70 hover:bg-slate-800 border border-slate-700/50 transition"
                        >
                            <span className="flex items-center gap-2">
                                <ExternalLink className="w-3.5 h-3.5 text-yellow-400" />
                                <span>View Live Site</span>
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold">↗</span>
                        </a>

                        <button
                            type="button"
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition cursor-pointer"
                        >
                            <span className="flex items-center gap-2">
                                <LogOut className="w-3.5 h-3.5" />
                                <span>{loggingOut ? 'Signing out...' : 'Sign Out'}</span>
                            </span>
                            <span className="text-[10px] text-rose-400 font-semibold">Exit</span>
                        </button>

                        <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800">
                            <p className="text-[11px] text-slate-400">Signed in as:</p>
                            <p className="text-xs font-semibold text-slate-200 truncate">{userEmail || 'Administrator'}</p>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
