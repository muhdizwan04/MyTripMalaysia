import React, { useState, useMemo } from 'react';
import { X, Search, Plus, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { STATE_ACTIVITIES, DEFAULT_ACTIVITIES } from '../../lib/constants';

// Categories derived from constants + some extras
const CATEGORIES = [
    "All",
    "Food",
    "Breakfast",
    "Lunch",
    "Dinner",
    "Shopping",
    "Nature",
    "Theme Park",
    "Culture",
    "History",
    "Nightlife"
];

export default function AddActivityModal({ isOpen, onClose, selectedStates, onAddActivity, currentActivities }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Combine all available activities from selected states + defaults
    const allAvailableActivities = useMemo(() => {
        let pool = [...DEFAULT_ACTIVITIES];

        if (selectedStates && selectedStates.length > 0) {
            selectedStates.forEach(state => {
                if (STATE_ACTIVITIES[state]) {
                    // Tag state specific activities
                    const stateActs = STATE_ACTIVITIES[state].map(a => ({ ...a, locationLabel: state }));
                    pool = [...pool, ...stateActs];
                }
            });
        }

        // Remove duplicates by ID just in case
        return Array.from(new Map(pool.map(item => [item.id, item])).values());
    }, [selectedStates]);

    const filteredActivities = useMemo(() => {
        return allAvailableActivities.filter(activity => {
            const matchesSearch = activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                activity.category.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory = selectedCategory === 'All' ||
                activity.category === selectedCategory ||
                (selectedCategory === 'Food' && activity.type === 'food') || // Group all food
                (selectedCategory === 'Nature' && activity.category.includes('Nature'));

            return matchesSearch && matchesCategory;
        });
    }, [allAvailableActivities, searchQuery, selectedCategory]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-background w-full max-w-2xl rounded-xl shadow-xl border overflow-hidden flex flex-col max-h-[80vh]">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Add Activities</h2>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <div className="p-4 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search activities, food, places..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${selectedCategory === cat
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {filteredActivities.length > 0 ? (
                            filteredActivities.map(activity => {
                                const isSelected = currentActivities.some(a => a.id === activity.id);
                                return (
                                    <div
                                        key={activity.id}
                                        className={`p-3 border rounded-lg flex justify-between items-center cursor-pointer transition-all ${isSelected ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                                            }`}
                                        onClick={() => onAddActivity(activity)}
                                    >
                                        <div>
                                            <div className="font-medium">{activity.name}</div>
                                            <div className="text-xs text-muted-foreground flex items-center gap-2">
                                                <span>{activity.category}</span>
                                                {activity.locationLabel && <span className="bg-accent px-1.5 rounded text-[10px]">{activity.locationLabel}</span>}
                                            </div>
                                        </div>
                                        {isSelected ? (
                                            <div className="h-6 w-6 bg-primary text-white rounded-full flex items-center justify-center">
                                                <Check className="h-3 w-3" />
                                            </div>
                                        ) : (
                                            <div className="h-6 w-6 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                                <Plus className="h-3 w-3" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-span-full text-center py-8 text-muted-foreground">
                                No activities found matching your criteria.
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-4 border-t bg-muted/20 flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                        {currentActivities.length} activities selected
                    </div>
                    <Button onClick={onClose}>Done</Button>
                </div>
            </div>
        </div>
    );
}
