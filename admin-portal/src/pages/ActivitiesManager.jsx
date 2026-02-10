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

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Activity</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 text-sm">State</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Category</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Duration</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Best Time</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Price</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {[
                            { id: 1, name: 'Batu Caves', state: 'Selangor', category: 'Culture', duration: '2h', time: 'Morning', price: 0 },
                            { id: 2, name: 'KLCC Park', state: 'Kuala Lumpur', category: 'Nature', duration: '1.5h', time: 'Evening', price: 0 },
                            { id: 3, name: 'Penang Hill', state: 'Penang', category: 'Nature', duration: '3h', time: 'Morning', price: 30 },
                            { id: 4, name: 'Jonker Walk', state: 'Malacca', category: 'Shopping', duration: '2h', time: 'Night', price: 0 },
                            { id: 5, name: 'Kellie\'s Castle', state: 'Perak', category: 'History', duration: '1h', time: 'Afternoon', price: 10 },
                        ].map((activity) => (
                            <tr key={activity.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900">{activity.name}</td>
                                <td className="px-6 py-4 text-slate-600">{activity.state}</td>
                                <td className="px-6 py-4">
                                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider">{activity.category}</span>
                                </td>
                                <td className="px-6 py-4 text-slate-600 font-medium">{activity.duration}</td>
                                <td className="px-6 py-4 text-slate-600">{activity.time}</td>
                                <td className="px-6 py-4 text-slate-900 font-bold">RM {activity.price}</td>
                                <td className="px-6 py-4">
                                    <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
