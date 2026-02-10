import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    AreaChart,
    Area
} from 'recharts';
import { TrendingUp, Users, Search, MapPin } from 'lucide-react';

const searchData = [
    { destination: 'Penang', searches: 4500 },
    { destination: 'Sabah', searches: 3800 },
    { destination: 'Kuala Lumpur', searches: 3200 },
    { destination: 'Langkawi', searches: 2900 },
    { destination: 'Melaka', searches: 2400 },
    { destination: 'Cameron Highlands', searches: 2100 },
];

const trafficData = [
    { name: 'Mon', active: 4000, searches: 2400 },
    { name: 'Tue', active: 3000, searches: 1398 },
    { name: 'Wed', active: 2000, searches: 9800 },
    { name: 'Thu', active: 2780, searches: 3908 },
    { name: 'Fri', active: 1890, searches: 4800 },
    { name: 'Sat', active: 2390, searches: 3800 },
    { name: 'Sun', active: 3490, searches: 4300 },
];

const trendingKeywords = [
    { word: 'Nasi Kandar', count: 1200, trend: 'up' },
    { word: 'Beachfront Resort', count: 950, trend: 'up' },
    { word: 'Hiking Trails', count: 820, trend: 'down' },
    { word: 'Street Art', count: 750, trend: 'up' },
    { word: 'Night Market', count: 680, trend: 'neutral' },
    { word: 'Seafood Dinner', count: 620, trend: 'up' },
    { word: 'Budget Stay', count: 590, trend: 'down' },
    { word: 'Island Hopping', count: 540, trend: 'neutral' },
];

export default function AnalyticsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Search Analytics & Insights</h2>
                <p className="text-slate-500">Understand what users are searching for and trending destinations.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-surface p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <Search size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Searches (Last 7d)</p>
                            <p className="text-2xl font-bold">24,892</p>
                        </div>
                    </div>
                </div>
                <div className="bg-surface p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Top Destination</p>
                            <p className="text-2xl font-bold">Penang</p>
                        </div>
                    </div>
                </div>
                <div className="bg-surface p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Daily Active Users</p>
                            <p className="text-2xl font-bold">1,420</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Destinations Chart */}
                <div className="bg-surface p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-900 mb-6">Top Searched Destinations</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={searchData} layout="vertical" margin={{ left: 20, right: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="destination"
                                    type="category"
                                    width={120}
                                    axisLine={false}
                                    tickLine={false}
                                    style={{ fontSize: '12px', fontWeight: 500 }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="searches" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Search Traffic Trend */}
                <div className="bg-surface p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-900 mb-6">Search Traffic Trend</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trafficData}>
                                <defs>
                                    <linearGradient id="colorSearches" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="searches"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorSearches)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Trending Keywords Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-surface p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-slate-900">Most Famous Trend Words</h3>
                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Live Trends</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {trendingKeywords.map((item) => (
                            <div
                                key={item.word}
                                className="px-4 py-2 rounded-full bg-slate-50 border border-slate-100 flex items-center space-x-2 hover:border-primary transition-colors cursor-default"
                            >
                                <span className="text-sm font-semibold text-slate-700">{item.word}</span>
                                <span className="text-xs text-slate-400">({item.count})</span>
                                {item.trend === 'up' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                                {item.trend === 'down' && <div className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                                {item.trend === 'neutral' && <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-surface p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-900 mb-6">Emerging Trends</h3>
                    <div className="space-y-4">
                        {[
                            { label: 'Foodie Tours', trend: '+24%', color: 'text-emerald-600' },
                            { label: 'Eco-Tourism', trend: '+12%', color: 'text-emerald-600' },
                            { label: 'Budget Hotels', trend: '-5%', color: 'text-red-600' },
                            { label: 'Solo Travel', trend: '+18%', color: 'text-emerald-600' },
                        ].map((insight) => (
                            <div key={insight.label} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-700">{insight.label}</span>
                                <span className={`text-sm font-bold ${insight.color}`}>{insight.trend}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
