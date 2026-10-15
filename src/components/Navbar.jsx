'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/specifications', label: 'Specifications' },
    { href: '/why-us', label: 'Why Us' },
    { href: '/projects', label: 'Projects' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
];

const socialLinks = [
    {
        name: 'Facebook',
        href: 'https://www.facebook.com/indiawallsofficial/',
        icon: `${process.env.NEXT_PUBLIC_IMAGES}/facebook.webp`,
    },
    {
        name: 'Instagram',
        href: 'https://www.instagram.com/indiawallsofficial/',
        icon: `${process.env.NEXT_PUBLIC_IMAGES}/instagram.webp`,
    },
    {
        name: 'YouTube',
        href: 'https://www.youtube.com/channel/UCKtbPe4q1zKgwNjKLMLK-RQ',
        icon: `${process.env.NEXT_PUBLIC_IMAGES}/youtube.webp`,
    },
];

function SocialIcons({ className = '' }) {
    return (
        <div className={className}>
            {socialLinks.map(({ name, href, icon }) => (
                <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    className="text-slate-100 transition-colors hover:text-yellow-400"
                >
                    <Image
                        src={icon}
                        alt={`${name} Logo`}
                        width={24}
                        height={24}
                        className="object-contain"
                    />
                </a>
            ))}
        </div>
    );
}

export default function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);
    const lastScrollY = useRef(0);

    const isActive = (href) =>
        href === '/' ? pathname === '/' : pathname === href || pathname?.startsWith(`${href}/`);

    const toggleMenu = () => setIsOpen((prev) => !prev);
    const closeMenu = () => setIsOpen(false);

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Translucent glass effect when scrolled past top
            setIsScrolled(currentScrollY > 20);

            // If mobile menu is open, keep navbar visible
            if (isOpen) {
                setIsVisible(true);
                lastScrollY.current = currentScrollY;
                ticking = false;
                return;
            }

            // Always visible at the top
            if (currentScrollY < 60) {
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY.current && currentScrollY - lastScrollY.current > 8) {
                // Scrolling down -> hide navbar
                setIsVisible(false);
            } else if (currentScrollY < lastScrollY.current && lastScrollY.current - currentScrollY > 8) {
                // Scrolling up -> reveal navbar with smooth animation
                setIsVisible(true);
            }

            lastScrollY.current = currentScrollY;
            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(handleScroll);
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [isOpen]);

    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.documentElement.style.setProperty('--navbar-offset', isVisible ? '5rem' : '0px');
        }
    }, [isVisible]);

    useEffect(() => {
        return () => {
            if (typeof document !== 'undefined') {
                document.documentElement.style.setProperty('--navbar-offset', '0px');
            }
        };
    }, []);

    return (
        <nav
            className={`sticky w-full top-0 z-100 transition-all duration-300 ease-in-out ${
                isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
            } ${
                isScrolled
                    ? 'bg-gray-900/80 backdrop-blur-md border-b border-gray-800/80 shadow-lg shadow-black/20'
                    : 'bg-gray-900/95 backdrop-blur-md border-b border-gray-800 shadow-sm'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link
                    href="/"
                    className="text-2xl font-extrabold tracking-tight text-slate-100 sm:text-4xl"
                    onClick={closeMenu}
                >
                    Rajasthan<span className="text-yellow-400">Wall</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-5 lg:gap-6 font-medium text-slate-100">
                    <div className="flex items-center gap-5 lg:gap-6">
                        {navLinks.map((link) => {
                            const active = isActive(link.href);

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`transition-all duration-200 relative ${active
                                        ? 'text-yellow-400 font-semibold'
                                        : 'text-slate-100 hover:text-yellow-400'
                                        } text-xl`}
                                    aria-current={active ? 'page' : undefined}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>
                    <SocialIcons className="flex items-center gap-3" />
                </div>

                {/* Animated Mobile Hamburger Button */}
                <button
                    onClick={toggleMenu}
                    type="button"
                    className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-md text-slate-100 hover:text-yellow-400 hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                    aria-controls="mobile-menu"
                    aria-expanded={isOpen}
                    aria-label="Toggle navigation menu"
                >
                    <div className="w-6 h-6 relative">
                        <span
                            className={`absolute left-0 top-1/2 w-full h-0.5 bg-current rounded-full transition-transform duration-200 origin-center ${isOpen ? 'translate-y-0 rotate-45' : '-translate-y-2'
                                }`}
                        />
                        {/* Middle Line */}
                        <span
                            className={`absolute left-0 top-1/2 w-full h-0.5 -translate-y-1/2 bg-current rounded-full transition-all duration-200 ${isOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
                                }`}
                        />
                        {/* Bottom Line */}
                        <span
                            className={`absolute left-0 top-1/2 w-full h-0.5 bg-current rounded-full transition-transform duration-200 origin-center ${isOpen ? 'translate-y-0 -rotate-45' : 'translate-y-2'
                                }`}
                        />
                    </div>
                </button>
            </div>

            {/* Mobile Dropdown Drawer with Smooth Scale & Fade Animation */}
            <div
                id="mobile-menu"
                className={`md:hidden overflow-hidden transition-all duration-200 ease-in-out bg-gray-900 border-b border-gray-800 will-change-[transform,opacity] ${isOpen ? 'scale-y-100 opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none absolute w-full'
                    }`}
            >
                <div className="px-4 space-y-1">
                    {navLinks.map((link) => {
                        const active = isActive(link.href);

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={closeMenu}
                                className={`block px-4 py-2.5 rounded-lg font-medium text-base text-center transition-all duration-200 ${active
                                    ? 'text-yellow-400 font-semibold translate-x-1'
                                    : 'text-slate-100 hover:text-yellow-400 hover:bg-gray-800/30 hover:translate-x-1'
                                    }`}
                                aria-current={active ? 'page' : undefined}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                    <SocialIcons className="flex items-center justify-center gap-6 py-3" />
                </div>
            </div>
        </nav>
    );
}