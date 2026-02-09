import React from 'react';

export function Footer() {
    return (
        <footer className="bg-background border-t py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} MyMalaysiaTrip. All rights reserved.</p>
            </div>
        </footer>
    );
}
