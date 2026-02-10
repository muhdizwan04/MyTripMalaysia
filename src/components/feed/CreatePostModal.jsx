import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { X, Upload, MapPin, Utensils, Camera, AlertCircle } from 'lucide-react';

export default function CreatePostModal({ isOpen, onClose }) {
    const [postData, setPostData] = useState({
        type: 'food',
        placeName: '',
        location: '',
        description: '',
        state: 'Kuala Lumpur'
    });
    const [error, setError] = useState('');

    const handleSubmit = () => {
        // Validation
        if (!postData.placeName.trim()) {
            setError('Please enter the place name');
            return;
        }
        if (!postData.location.trim()) {
            setError('Please enter the location');
            return;
        }
        if (!postData.description.trim()) {
            setError('Please add a description');
            return;
        }

        // Success simulation
        alert(`Post created! Type: ${postData.type}, Place: ${postData.placeName}`);
        onClose();
        // Reset form
        setPostData({
            type: 'food',
            placeName: '',
            location: '',
            description: '',
            state: 'Kuala Lumpur'
        });
        setError('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[32px] p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-black tracking-tight">Share Your Discovery</h2>
                    <button
                        onClick={onClose}
                        className="h-10 w-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Post Type Selector */}
                <div className="mb-6">
                    <label className="block text-sm font-bold text-muted-foreground mb-3">Post Type *</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setPostData({ ...postData, type: 'food' })}
                            className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${postData.type === 'food'
                                    ? 'border-orange-500 bg-orange-50'
                                    : 'border-muted hover:border-orange-300'
                                }`}
                        >
                            <Utensils className={`h-6 w-6 ${postData.type === 'food' ? 'text-orange-500' : 'text-muted-foreground'}`} />
                            <span className="font-black text-sm">Food</span>
                        </button>
                        <button
                            onClick={() => setPostData({ ...postData, type: 'scenery' })}
                            className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${postData.type === 'scenery'
                                    ? 'border-emerald-500 bg-emerald-50'
                                    : 'border-muted hover:border-emerald-300'
                                }`}
                        >
                            <Camera className={`h-6 w-6 ${postData.type === 'scenery' ? 'text-emerald-500' : 'text-muted-foreground'}`} />
                            <span className="font-black text-sm">Scenery</span>
                        </button>
                    </div>
                </div>

                {/* Image Upload Placeholder */}
                <div className="mb-6">
                    <label className="block text-sm font-bold text-muted-foreground mb-3">Photo *</label>
                    <div className="border-2 border-dashed border-muted rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/50 transition-colors">
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm font-bold text-muted-foreground">Click to upload photo</p>
                        <p className="text-xs text-muted-foreground/60 mt-1">(Feature coming soon)</p>
                    </div>
                </div>

                {/* Place Name */}
                <div className="mb-6">
                    <label className="block text-sm font-bold text-muted-foreground mb-3">
                        {postData.type === 'food' ? 'Restaurant/Shop Name' : 'Place Name'} *
                    </label>
                    <input
                        type="text"
                        value={postData.placeName}
                        onChange={(e) => setPostData({ ...postData, placeName: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border-2 border-muted focus:border-primary outline-none font-bold"
                        placeholder={postData.type === 'food' ? 'e.g., Village Park Restaurant' : 'e.g., Batu Caves'}
                    />
                </div>

                {/* State Selector */}
                <div className="mb-6">
                    <label className="block text-sm font-bold text-muted-foreground mb-3">State *</label>
                    <select
                        value={postData.state}
                        onChange={(e) => setPostData({ ...postData, state: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border-2 border-muted focus:border-primary outline-none font-bold"
                    >
                        <option value="Kuala Lumpur">Kuala Lumpur</option>
                        <option value="Selangor">Selangor</option>
                        <option value="Penang">Penang</option>
                        <option value="Melaka">Melaka</option>
                        <option value="Johor">Johor</option>
                        <option value="Pahang">Pahang</option>
                        <option value="Perak">Perak</option>
                        <option value="Kedah">Kedah</option>
                    </select>
                </div>

                {/* Location */}
                <div className="mb-6">
                    <label className="block text-sm font-bold text-muted-foreground mb-3">Location (Area/District) *</label>
                    <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                            type="text"
                            value={postData.location}
                            onChange={(e) => setPostData({ ...postData, location: e.target.value })}
                            className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-muted focus:border-primary outline-none font-bold"
                            placeholder="e.g., Petaling Jaya, Selangor"
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                    <label className="block text-sm font-bold text-muted-foreground mb-3">Description *</label>
                    <textarea
                        value={postData.description}
                        onChange={(e) => setPostData({ ...postData, description: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border-2 border-muted focus:border-primary outline-none font-bold resize-none"
                        rows="4"
                        placeholder="Share your experience, recommendations, or tips..."
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                        <p className="text-sm font-bold text-red-800">{error}</p>
                    </div>
                )}

                {/* Info Box */}
                <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-2xl">
                    <p className="text-xs font-bold text-blue-800">
                        ℹ️ Only posts about food and scenery are allowed. Share your authentic Malaysian experiences!
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1 h-14 rounded-2xl"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="flex-1 h-14 rounded-2xl"
                    >
                        Post
                    </Button>
                </div>
            </div>
        </div>
    );
}
