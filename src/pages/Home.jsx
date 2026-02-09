import React from 'react';
import { Button } from '../components/ui/Button';

export default function Home() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                    Discover Malaysia's Best Kept Secrets
                </h1>
                <p className="mt-6 text-lg leading-8 text-muted-foreground">
                    Plan your perfect trip with AI-powered itineraries. Explore hidden gems, track expenses, and travel seamlessly.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Button size="lg">Start Planning</Button>
                    <Button variant="outline" size="lg">Learn More</Button>
                </div>
            </div>
        </div>
    );
}
