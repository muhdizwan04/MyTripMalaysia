import React from 'react';

export default function HotelsManager() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Hotels Manager</h2>
                    <p className="text-slate-500">Manage accommodation listings across Malaysia.</p>
                </div>
                <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl font-medium transition-colors">
                    Add New Hotel
                </button>
            </div>

            <div className="bg-surface rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                    <input
                        type="text"
                        placeholder="Search hotels..."
                        className="w-full max-w-sm px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                </div>
                <div className="p-12 text-center text-slate-400">
                    No hotels found. Start by adding one to the database.
                </div>
            </div>
        </div>
    );
}
