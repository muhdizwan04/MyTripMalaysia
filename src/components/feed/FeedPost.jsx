import React, { useState } from 'react';
import { MapPin, Star, Heart, Bookmark, MessageCircle, Utensils, Camera } from 'lucide-react';

export default function FeedPost({ post }) {
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);

    return (
        <div className="bg-white rounded-[32px] overflow-hidden shadow-lg border-2 border-muted/20 mb-6">
            {/* Post Image */}
            <div className="relative aspect-square overflow-hidden">
                <img
                    src={post.image}
                    alt={post.placeName}
                    className="w-full h-full object-cover"
                />
                {/* Category Badge */}
                <div className="absolute top-4 right-4">
                    <div className={`px-4 py-2 rounded-full font-black text-xs uppercase tracking-wider flex items-center gap-2 
                        ${post.type === 'food' ? 'bg-orange-500 text-white' : 'bg-emerald-500 text-white'}`}>
                        {post.type === 'food' ? <Utensils className="h-3 w-3" /> : <Camera className="h-3 w-3" />}
                        {post.type}
                    </div>
                </div>
            </div>

            {/* Post Content */}
            <div className="p-6">
                {/* User Info */}
                <div className="flex items-center gap-3 mb-4">
                    <img
                        src={post.user.avatar}
                        alt={post.user.name}
                        className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                        <p className="font-black text-sm">{post.user.name}</p>
                        <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                    </div>
                </div>

                {/* Place Name */}
                <h3 className="text-xl font-black tracking-tight mb-2">{post.placeName}</h3>

                {/* Location */}
                <div className="flex items-center gap-2 mb-3">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-sm font-bold text-muted-foreground">{post.location}</span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <span className="font-black text-sm">{post.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground font-bold">({post.reviewCount} reviews)</span>
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed text-foreground mb-4">{post.description}</p>

                {/* Engagement Stats */}
                <div className="flex items-center gap-6 pt-4 border-t-2 border-muted/20">
                    <button
                        onClick={() => setLiked(!liked)}
                        className="flex items-center gap-2 transition-colors"
                    >
                        <Heart
                            className={`h-5 w-5 transition-all ${liked ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
                        />
                        <span className={`text-sm font-bold ${liked ? 'text-red-500' : 'text-muted-foreground'}`}>
                            {liked ? post.likes + 1 : post.likes}
                        </span>
                    </button>

                    <button
                        onClick={() => setSaved(!saved)}
                        className="flex items-center gap-2 transition-colors"
                    >
                        <Bookmark
                            className={`h-5 w-5 transition-all ${saved ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                        />
                        <span className={`text-sm font-bold ${saved ? 'text-primary' : 'text-muted-foreground'}`}>
                            {saved ? post.saves + 1 : post.saves}
                        </span>
                    </button>

                    <div className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-bold text-muted-foreground">{post.comments}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
