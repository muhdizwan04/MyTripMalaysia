import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Map, DollarSign, User, PlusCircle, Train } from 'lucide-react';
import { clsx } from 'clsx';

export function MobileNav() {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t h-16 z-50 px-4 pb-safe">
            <div className="grid grid-cols-5 h-full items-center">
                <NavLink
                    to="/"
                    className={({ isActive }) => clsx(
                        "flex flex-col items-center justify-center h-full gap-1",
                        isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <Home className="h-5 w-5" />
                    <span className="text-[10px] font-medium">Home</span>
                </NavLink>

                <NavLink
                    to="/transport"
                    className={({ isActive }) => clsx(
                        "flex flex-col items-center justify-center h-full gap-1",
                        isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <Train className="h-5 w-5" />
                    <span className="text-[10px] font-medium">Transport</span>
                </NavLink>

                <NavLink
                    to="/trips/create"
                    className="flex flex-col items-center justify-center h-full -mt-4"
                >
                    <div className="bg-primary text-primary-foreground rounded-full p-3 shadow-lg">
                        <PlusCircle className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-medium mt-1">Plan</span>
                </NavLink>

                <NavLink
                    to="/trips"
                    className={({ isActive }) => clsx(
                        "flex flex-col items-center justify-center h-full gap-1",
                        isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <Map className="h-5 w-5" />
                    <span className="text-[10px] font-medium">Trips</span>
                </NavLink>

                <NavLink
                    to="/profile"
                    className={({ isActive }) => clsx(
                        "flex flex-col items-center justify-center h-full gap-1",
                        isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <User className="h-5 w-5" />
                    <span className="text-[10px] font-medium">Profile</span>
                </NavLink>
            </div>
        </div>
    );
}
