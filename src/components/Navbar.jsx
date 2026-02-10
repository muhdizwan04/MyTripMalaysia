import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Map, User, Menu, X, LogOut, Home, Compass } from 'lucide-react';

export function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isAuthPage = location.pathname.includes('/auth');

    if (isAuthPage) return null;

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { path: '/', label: 'Home', icon: Home },
        { path: '/trips', label: 'My Trip', icon: Compass },
        { path: '/auth/login', label: 'Login', icon: User },
        { path: '/auth/signup', label: 'Sign Up', icon: User },
    ];

    return (
        <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/20">
            <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center">
                        <Map className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-black text-lg tracking-tight text-primary">TRIP.MY</span>
                </Link>

                {/* Desktop Links (Hidden on Mobile) */}
                <div className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`text-sm font-bold transition-colors ${isActive(link.path) ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Mobile Hamburger Menu */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden p-2 text-primary hover:bg-primary/5 rounded-full transition-colors"
                >
                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Dropdown Menu */}
            {isMenuOpen && (
                <div className="absolute top-16 left-0 right-0 bg-white border-b border-muted/20 shadow-xl md:hidden animate-in slide-in-from-top-2">
                    <div className="max-w-md mx-auto p-4 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${isActive(link.path)
                                    ? 'bg-primary/10 text-primary'
                                    : 'hover:bg-muted text-muted-foreground'
                                    }`}
                            >
                                <link.icon className="h-5 w-5" />
                                <span className="font-bold">{link.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}
