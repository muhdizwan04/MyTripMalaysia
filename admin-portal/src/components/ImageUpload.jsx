import React, { useState, useRef } from 'react';
import { uploadFile } from '../lib/api';
import { Upload, Link, X, Check, Loader2 } from 'lucide-react';

export default function ImageUpload({ value, onChange, label = "Image" }) {
    const [uploading, setUploading] = useState(false);
    const [mode, setMode] = useState(value && !value.includes('firebasestorage') ? 'url' : 'file');
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const data = await uploadFile(file);
            onChange(data.url);
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-700">{label}</label>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button
                        type="button"
                        onClick={() => setMode('file')}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${mode === 'file' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        File
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('url')}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${mode === 'url' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        URL
                    </button>
                </div>
            </div>

            {mode === 'file' ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-2xl p-6 transition-all cursor-pointer group
                        ${value ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-primary hover:bg-slate-50'}`}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />

                    {uploading ? (
                        <div className="flex flex-col items-center justify-center py-4">
                            <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
                            <p className="text-sm font-bold text-slate-600">Uploading to Firebase...</p>
                        </div>
                    ) : value ? (
                        <div className="relative group/preview">
                            <img src={value} alt="Preview" className="w-full h-40 object-cover rounded-xl shadow-md" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                                <p className="text-white text-sm font-bold flex items-center gap-2">
                                    <Check className="h-4 w-4" /> Change Image
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-4">
                            <div className="bg-primary/10 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
                                <Upload className="h-6 w-6 text-primary" />
                            </div>
                            <p className="text-sm font-bold text-slate-600">Click to upload image</p>
                            <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Link className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary font-bold text-sm"
                        placeholder="Paste image URL here..."
                    />
                    {value && (
                        <div className="mt-2 relative group">
                            <img src={value} alt="URL Preview" className="w-full h-32 object-cover rounded-xl border border-slate-100 shadow-sm" />
                            <button
                                onClick={() => onChange('')}
                                className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white text-slate-600 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
