import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, MapPin } from 'lucide-react';
import { Button } from './ui/Button';

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-background border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <MapPin className="h-8 w-8 text-primary" />
                            <span className="ml-2 text-xl font-bold text-primary">MyMalaysiaTrip</span>
                        </Link>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
                        <Link to="/" className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                            Home
                        </Link>
                        <Link to="/trips" className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                            My Trips
                        </Link>
                        <Button variant="outline" size="sm" asChild>
                            <Link to="/auth/login">Log In</Link>
                        </Button>
                        <Button size="sm" asChild>
                            <Link to="/auth/signup">Sign Up</Link>
                        </Button>
                    </div>
                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-primary focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="sm:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        <Link
                            to="/"
                            className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-accent"
                        >
                            Home
                        </Link>
                        <Link
                            to="/trips"
                            className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-accent"
                        >
                            My Trips
                        </Link>
                        <div className="mt-4 px-3 space-y-2">
                            <Button variant="outline" className="w-full justify-center" asChild>
                                <Link to="/auth/login">Log In</Link>
                            </Button>
                            <Button className="w-full justify-center" asChild>
                                <Link to="/auth/signup">Sign Up</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
