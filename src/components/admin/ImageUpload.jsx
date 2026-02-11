import React, { useState, useRef } from 'react';
import { Upload, Link, X, Check, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';

export const ImageUpload = ({ value, onChange, label = "Image" }) => {
    const [uploading, setUploading] = useState(false);
    const [mode, setMode] = useState(value && !value.includes('firebasestorage') ? 'url' : 'file');
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('image', file);

            const response = await api.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            onChange(response.data.url);
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const clearImage = () => {
        onChange('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-bold">{label}</label>
                <div className="flex bg-muted/20 p-1 rounded-lg">
                    <button
                        type="button"
                        onClick={() => setMode('file')}
                        className={`px-3 py-1 text-[10px] font-black rounded-md transition-all ${mode === 'file' ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:bg-muted/30'}`}
                    >
                        UPLOAD FILE
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('url')}
                        className={`px-3 py-1 text-[10px] font-black rounded-md transition-all ${mode === 'url' ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:bg-muted/30'}`}
                    >
                        IMAGE URL
                    </button>
                </div>
            </div>

            <div className="relative group">
                {mode === 'url' ? (
                    <div className="relative">
                        <Link className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="url"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-muted focus:border-primary outline-none transition-colors text-sm font-bold"
                        />
                    </div>
                ) : (
                    <div
                        onClick={() => !uploading && fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-2xl p-6 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${value ? 'border-primary/50 bg-primary/5' : 'border-muted hover:border-primary/30 bg-muted/5'}`}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                        />

                        {uploading ? (
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                                <p className="text-[10px] font-bold text-muted-foreground">UPLOADING...</p>
                            </div>
                        ) : value ? (
                            <div className="relative w-full flex flex-col items-center gap-3">
                                <div className="w-24 h-24 rounded-xl overflow-hidden shadow-lg border-2 border-white">
                                    <img src={value} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-500" />
                                    <p className="text-[10px] font-black text-green-600 uppercase">Image Ready</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); clearImage(); }}
                                    className="absolute -top-4 -right-2 p-2 bg-white text-red-500 rounded-full shadow-md hover:bg-red-50 transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <div className="p-3 bg-primary/10 text-primary rounded-full">
                                    <Upload className="h-6 w-6" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-black">Click to Upload PNG/JPG</p>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">MAX SIZE 5MB</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
