import React from 'react';

export default function ActivitiesManager() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Activities Manager</h2>
                    <p className="text-slate-500">Manage activities and points of interest across Malaysian states.</p>
                </div>
                <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl font-medium transition-colors">
                    Add Activity
                </button>
            </div>

            <div className="bg-surface rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-12 text-center text-slate-400">
                Filter by state and category to manage activities.
            </div>
        </div>
    );
}
