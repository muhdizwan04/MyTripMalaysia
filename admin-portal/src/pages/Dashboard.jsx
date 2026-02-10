import React from 'react';
import { Hotel, MapPin, Utensils, Users, Search } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const stats = [
    { name: 'Total Hotels', value: '124', icon: Hotel, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Active Activities', value: '3,452', icon: MapPin, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { name: 'Food Spots', value: '850', icon: Utensils, color: 'text-orange-600', bg: 'bg-orange-100' },
    { name: 'Total Users', value: '12,345', icon: Search, color: 'text-purple-600', bg: 'bg-purple-100' },
];

const searchData = [
    { name: 'Penang', value: 4500 },
    { name: 'Sabah', value: 3800 },
    { name: 'KL', value: 3200 },
    { name: 'Langkawi', value: 2900 },
    { name: 'Melaka', value: 2400 },
];

export default function Dashboard() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Welcome back, Admin</h2>
                <p className="text-slate-500">Here's what's happening with MyMalaysiaTrip today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-surface p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">{stat.name}</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                            </div>
                            <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-surface p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-slate-900">Highest Search (States)</h3>
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">Weekly Trend</span>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={searchData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                />
                                <YAxis hide />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-surface p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-slate-900">Trending Now</h3>
                        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Top 5 Words</span>
                    </div>
                    <div className="space-y-4">
                        {[
                            { word: 'Nasi Kandar', trend: '+12%', color: 'text-emerald-600' },
                            { word: 'Street Art', trend: '+8%', color: 'text-emerald-600' },
                            { word: 'Beachfront', trend: '+5%', color: 'text-emerald-600' },
                            { word: 'Night Market', trend: '+3%', color: 'text-slate-400' },
                            { word: 'Budget Stay', trend: '-2%', color: 'text-red-600' },
                        ].map((item, idx) => (
                            <div key={item.word} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                                <div className="flex items-center space-x-3">
                                    <span className="text-xs font-bold text-slate-400">#0{idx + 1}</span>
                                    <span className="text-sm font-semibold text-slate-700">{item.word}</span>
                                </div>
                                <span className={`text-xs font-bold ${item.color}`}>{item.trend}</span>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-xl transition-colors">
                        View Detailed Insights
                    </button>
                </div>
            </div>
        </div>
    );
}
