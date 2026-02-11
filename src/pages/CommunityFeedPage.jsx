import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import FeedPost from '../components/feed/FeedPost';
import CreatePostModal from '../components/feed/CreatePostModal';
import { fetchCommunityPosts } from '../lib/api';

export default function CommunityFeedPage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPosts = async () => {
            try {
                setLoading(true);
                const data = await fetchCommunityPosts();
                // Transform backend data to match FeedPost component format
                const transformedPosts = data.map(post => ({
                    id: post.id,
                    placeName: post.location || post.attraction_reference || 'Unknown Location',
                    location: post.location || '',
                    state: post.state || 'Malaysia',
                    image: post.image_url,
                    description: post.caption || '',
                    type: post.tags?.includes('FOOD') || post.tags?.includes('KL FOOD') ? 'food' : 'scenery',
                    likes: post.likes || 0,
                    shares: post.shares || 0,
                    comments: post.comments || 0,
                    username: post.author || 'Anonymous',
                    userAvatar: post.author_image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
                    isVerified: false,
                    tags: post.tags || []
                }));
                setPosts(transformedPosts);
            } catch (error) {
                console.error('Failed to load community posts:', error);
            } finally {
                setLoading(false);
            }
        };
        loadPosts();
    }, []);

    const filteredPosts = posts.filter(post => {
        if (activeFilter !== 'all' && post.type !== activeFilter) {
            return false;
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            return (
                post.placeName.toLowerCase().includes(query) ||
                post.location.toLowerCase().includes(query) ||
                post.description.toLowerCase().includes(query) ||
                post.state.toLowerCase().includes(query)
            );
        }

        return true;
    });

    return (
        <div className="min-h-screen bg-batik pb-24">
            <div className="max-w-md mx-auto px-6 py-10">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span className="text-sm font-bold">Back</span>
                    </button>
                    <h1 className="text-4xl font-black tracking-tighter mb-2">Community Feed</h1>
                    <p className="text-sm text-muted-foreground font-medium">
                        Discover food and scenery experiences from travelers
                    </p>
                </div>

                {/* Search & Filter */}
                <div className="mb-6 space-y-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search posts..."
                            className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-muted/50 focus:border-primary outline-none font-bold text-sm bg-white"
                        />
                    </div>

                    <select
                        value={activeFilter}
                        onChange={(e) => setActiveFilter(e.target.value)}
                        className="w-full text-sm font-black px-4 py-3 rounded-2xl border-2 border-muted/50 bg-white outline-none cursor-pointer hover:border-primary/50 transition-colors"
                    >
                        <option value="all">All Posts</option>
                        <option value="food">🍽️ Food Only</option>
                        <option value="scenery">📸 Scenery Only</option>
                    </select>
                </div>

                {/* Feed Posts */}
                <div className="space-y-6">
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-3"></div>
                            <p className="text-sm font-medium text-muted-foreground">Loading posts...</p>
                        </div>
                    ) : filteredPosts.length > 0 ? (
                        filteredPosts.map((post) => (
                            <FeedPost key={post.id} post={post} />
                        ))
                    ) : (
                        <div className="text-center py-20 bg-muted/10 rounded-3xl">
                            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                            <p className="text-muted-foreground font-bold">No posts found</p>
                            <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filter</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Create Post Button */}
            <button
                onClick={() => setShowCreatePost(true)}
                className="fixed bottom-24 right-6 h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary/80 text-white shadow-2xl shadow-primary/30 hover:scale-110 transition-transform flex items-center justify-center z-40"
            >
                <span className="text-3xl font-black">+</span>
            </button>

            <CreatePostModal
                isOpen={showCreatePost}
                onClose={() => setShowCreatePost(false)}
            />
        </div>
    );
}
