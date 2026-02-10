import React from 'react';

export default function LogisticsManager() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Logistics & Transport Manager</h2>
                <p className="text-slate-500">Configure global transport estimates and route guidance parameters.</p>
            </div>

            <div className="bg-surface rounded-2xl border border-slate-200 shadow-sm p-8">
                <h3 className="font-semibold text-slate-900 mb-6">Global Transport Rates</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-slate-700">Grab Base Rate (RM/km)</label>
                        <input type="number" defaultValue="1.50" className="w-full px-4 py-2 rounded-lg border border-slate-200" />
                    </div>
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-slate-700">Average Petrol Cost (RM/km)</label>
                        <input type="number" defaultValue="0.25" className="w-full px-4 py-2 rounded-lg border border-slate-200" />
                    </div>
                </div>
            </div>
        </div>
    );
}
