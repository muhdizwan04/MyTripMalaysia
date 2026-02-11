import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Hotel,
    MapPin,
    Utensils,
    Truck,
    Search,
    Menu,
    X,
    ChevronRight,
    User,
    Globe,
    ShoppingBag,
    Store
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Destinations', path: '/destinations', icon: Globe },
    { name: 'Attractions', path: '/activities', icon: MapPin },
    { name: 'Hotels', path: '/hotels', icon: Hotel },
    { name: 'Logistics', path: '/logistics', icon: Truck },
    { name: 'Analytics', path: '/analytics', icon: Search },
];

export default function Layout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <aside className={cn(
                "bg-surface border-r border-slate-200 transition-all duration-300 ease-in-out flex flex-col",
                isSidebarOpen ? "w-64" : "w-20"
            )}>
                <div className="p-6 flex items-center justify-between">
                    {isSidebarOpen ? (
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            MyTrip Admin
                        </span>
                    ) : (
                        <span className="text-xl font-bold text-primary">M</span>
                    )}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-1 hover:bg-slate-100 rounded-md lg:hidden"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex items-center p-3 rounded-xl transition-all group",
                                    isActive
                                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                <Icon size={20} className={cn("min-w-[20px]", isActive ? "text-white" : "group-hover:text-primary")} />
                                {isSidebarOpen && (
                                    <span className="ml-3 font-medium">{item.name}</span>
                                )}
                                {isSidebarOpen && isActive && (
                                    <ChevronRight size={16} className="ml-auto opacity-50" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <div className={cn(
                        "flex items-center p-2 rounded-xl bg-slate-50",
                        !isSidebarOpen && "justify-center"
                    )}>
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <User size={18} />
                        </div>
                        {isSidebarOpen && (
                            <div className="ml-3 overflow-hidden">
                                <p className="text-sm font-semibold text-slate-900 truncate">Admin User</p>
                                <p className="text-xs text-slate-500 truncate">admin@mytrip.my</p>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Topbar */}
                <header className="h-16 bg-surface/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-slate-100 rounded-md mr-4"
                        >
                            <Menu size={20} />
                        </button>
                        <h1 className="text-lg font-semibold text-slate-900">
                            {navItems.find(i => i.path === location.pathname)?.name || 'Dashboard'}
                        </h1>
                    </div>

                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-slate-500 hidden sm:inline-block">
                            {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
}
