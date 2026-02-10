import React from 'react';

export default function DiscoveryManager() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Discovery & Social Manager</h2>
                <p className="text-slate-500">Curate food, shopping, and scenic recommendations.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {['Food Recommendations', 'Shopping Malls', 'Viral Scenic Spots'].map((category) => (
                    <div key={category} className="bg-surface p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <h3 className="font-semibold text-slate-900">{category}</h3>
                        <p className="text-sm text-slate-500 mt-2">Manage all items in this category.</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
