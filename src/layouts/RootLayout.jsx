import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { MobileNav } from '../components/MobileNav';

export function RootLayout() {
    return (
        <div className="flex flex-col min-h-screen bg-background font-sans antialiased text-foreground">

            <main className="flex-1 pb-16">
                <Outlet />
            </main>
            <MobileNav />
            <Footer />
        </div>
    );
}
