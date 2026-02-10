import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Heart, Bookmark, MessageCircle, LayoutGrid, Settings } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import FeedPost from '../components/feed/FeedPost';
import { FEED_POSTS } from '../lib/constants';

export default function Profile() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('posts');

    // Mock user data - will be replaced with real data later
    const userData = {
        name: "John Traveler",
        username: "@johntraveler",
        bio: "Exploring Malaysia one state at a time 🇲🇾✨",
        stats: {
            trips: 12,
            posts: 8,
            saved: 24
        }
    };

    // Mock activity data - use FEED_POSTS as examples
    const activityData = {
        posts: FEED_POSTS.slice(0, 2),
        comments: FEED_POSTS.slice(1, 4),
        liked: FEED_POSTS.slice(0, 3),
        saved: FEED_POSTS.slice(2, 5)
    };

    const tabs = [
        { id: 'posts', label: 'Posts', icon: LayoutGrid, count: activityData.posts.length },
        { id: 'comments', label: 'Comments', icon: MessageCircle, count: activityData.comments.length },
        { id: 'liked', label: 'Liked', icon: Heart, count: activityData.liked.length },
        { id: 'saved', label: 'Saved', icon: Bookmark, count: activityData.saved.length }
    ];

    return (
        <div className="min-h-screen bg-batik pb-24">
            <div className="max-w-md mx-auto px-6 py-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span className="text-sm font-bold">Back</span>
                    </button>
                    <button
                        onClick={() => navigate('/settings')}
                        className="h-10 w-10 rounded-full bg-white border-2 border-white/50 flex items-center justify-center hover:shadow-lg transition-all"
                    >
                        <Settings className="h-5 w-5 text-muted-foreground" />
                    </button>
                </div>

                {/* Profile Info */}
                <div className="mb-8">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border-4 border-white shadow-lg">
                            <User className="h-10 w-10 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-black tracking-tight mb-1">{userData.name}</h1>
                            <p className="text-sm text-muted-foreground font-medium mb-2">{userData.username}</p>
                            <p className="text-sm leading-relaxed">{userData.bio}</p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                        <Card className="border-2 border-white/50 rounded-2xl">
                            <CardContent className="p-4 text-center">
                                <p className="text-2xl font-black text-primary">{userData.stats.trips}</p>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Trips</p>
                            </CardContent>
                        </Card>
                        <Card className="border-2 border-white/50 rounded-2xl">
                            <CardContent className="p-4 text-center">
                                <p className="text-2xl font-black text-primary">{userData.stats.posts}</p>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Posts</p>
                            </CardContent>
                        </Card>
                        <Card className="border-2 border-white/50 rounded-2xl">
                            <CardContent className="p-4 text-center">
                                <p className="text-2xl font-black text-primary">{userData.stats.saved}</p>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Saved</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Activity Tabs */}
                <div className="mb-6">
                    <div className="flex w-full border-b border-muted/20 mb-6">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex flex-col items-center justify-center py-4 relative transition-colors ${activeTab === tab.id
                                    ? 'text-primary'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                <tab.icon className={`h-6 w-6 mb-1 ${activeTab === tab.id ? 'fill-current' : ''}`} />
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full mx-4" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Activity Content */}
                    <div className="space-y-6">
                        {activityData[activeTab].length > 0 ? (
                            activityData[activeTab].map((post) => (
                                <FeedPost key={post.id} post={post} />
                            ))
                        ) : (
                            <div className="text-center py-20 bg-muted/10 rounded-3xl">
                                {activeTab === 'posts' && <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />}
                                {activeTab === 'comments' && <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />}
                                {activeTab === 'liked' && <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />}
                                {activeTab === 'saved' && <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />}
                                <p className="text-muted-foreground font-bold">No {activeTab} yet</p>
                                <p className="text-xs text-muted-foreground mt-1">Start exploring to build your collection!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
