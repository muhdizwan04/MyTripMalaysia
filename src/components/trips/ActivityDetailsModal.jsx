import React from 'react';
import { X, Star, MapPin, Clock } from 'lucide-react';
import { Button } from '../ui/Button';

// Mock reviews
const REVIEWS = [
    { id: 1, user: "Sarah T.", rating: 5, text: "Absolutely loved this place! A must-visit.", date: "2 days ago" },
    { id: 2, user: "John D.", rating: 4, text: "Great experience, but a bit crowded.", date: "1 week ago" },
    { id: 3, user: "Ahmad Z.", rating: 5, text: "Authentic vibes and delicious food.", date: "2 weeks ago" }
];

export default function ActivityDetailsModal({ isOpen, onClose, activity }) {
    if (!isOpen || !activity) return null;

    // Use a placeholder image if none provided
    const image = activity.image || `https://source.unsplash.com/800x600/?${encodeURIComponent(activity.category || 'travel')},malaysia`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-background w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                <div className="relative h-64 bg-muted">
                    <img
                        src={image}
                        alt={activity.name}
                        className="w-full h-full object-cover"
                        // Fallback handling would go here
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&q=80&w=800'; }}
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white rounded-full"
                        onClick={onClose}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent pt-12">
                        <h2 className="text-2xl font-bold text-white">{activity.name}</h2>
                        <div className="flex items-center gap-2 text-white/90 text-sm mt-1">
                            <span className="bg-primary px-2 py-0.5 rounded text-white text-xs font-semibold">{activity.category}</span>
                            <span>•</span>
                            <span className="flex items-center"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" /> {activity.rating || 4.5}</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-24">
                    {/* Media Section (Video or Image) */}
                    <div className="space-y-4">
                        {activity.videoUrl ? (
                            <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-muted bg-black">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={activity.videoUrl}
                                    title={activity.name}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        ) : (
                            <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-muted relative">
                                <img
                                    src={activity.image || "https://images.unsplash.com/photo-1544013919-4bb5cb5b77ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                                    alt={activity.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                                        {activity.category || activity.type}
                                    </span>
                                </div>
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground italic text-center">
                            {activity.videoUrl ? "🎥 Watch the official preview" : "📍 Location Snapshot"}
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-primary/5 rounded-2xl flex items-center gap-3 border border-primary/10">
                            <Clock className="h-5 w-5 text-primary" />
                            <div>
                                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Duration</div>
                                <div className="font-bold">{activity.duration || 2} Hours</div>
                            </div>
                        </div>
                        <div className="p-4 bg-primary/5 rounded-2xl flex items-center gap-3 border border-primary/10">
                            <MapPin className="h-5 w-5 text-primary" />
                            <div>
                                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Location</div>
                                <div className="font-bold">{activity.state || 'Malaysia'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="font-bold text-lg mb-2">About this spot</h3>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                            {activity.description || "Experience the best of Malaysia at this iconic location. Perfect for travelers looking for local flavors and memorable experiences."}
                        </p>
                    </div>

                    {/* Reviews */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Traveler Reviews</h3>
                        <div className="space-y-4">
                            {(activity.reviews && activity.reviews.length > 0) ? (
                                activity.reviews.map((rev, i) => (
                                    <div key={i} className="p-4 bg-muted/20 rounded-2xl border border-muted/50 space-y-2">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                                                    {typeof rev === 'object' ? rev.user[0] : 'U'}
                                                </div>
                                                <span className="text-xs font-bold">{typeof rev === 'object' ? rev.user : 'User'}</span>
                                            </div>
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, s) => (
                                                    <Star key={s} className={`h-2.5 w-2.5 ${s < (rev.rating || 5) ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-xs text-muted-foreground italic leading-relaxed">
                                            "{typeof rev === 'object' ? rev.text : rev}"
                                        </p>
                                    </div>
                                ))
                            ) : (
                                ["Visit early morning", "Photography hotspot", "Local favorite"].map((tip, i) => (
                                    <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground p-3 bg-muted/10 rounded-xl">
                                        <div className="h-2 w-2 bg-primary rounded-full" /> {tip}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t bg-background/80 backdrop-blur-md flex justify-end gap-3 pb-8">
                    <Button variant="outline" onClick={onClose} className="rounded-2xl px-6">Close</Button>
                    <Button className="rounded-2xl px-8">Get Directions</Button>
                </div>
            </div>
        </div>
    );
}
