import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Eye, EyeOff, Lock, Mail, AtSign, LogOut } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function SettingsPage() {
    const navigate = useNavigate();
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    // Mock user data
    const [formData, setFormData] = useState({
        name: "John Traveler",
        username: "johntraveler",
        email: "john@example.com",
        bio: "Exploring Malaysia one state at a time 🇲🇾✨",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSaveProfile = () => {
        // Will be connected to backend later
        alert('Profile updated successfully!');
    };

    const handleChangePassword = () => {
        if (formData.newPassword !== formData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        // Will be connected to backend later
        alert('Password changed successfully!');
        setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    const handleLogout = () => {
        // Clear any auth tokens/state here
        navigate('/auth/login');
    };

    return (
        <div className="min-h-screen bg-batik pb-24">
            <div className="max-w-md mx-auto px-6 py-10">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/profile')}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span className="text-sm font-bold">Back to Profile</span>
                    </button>
                    <h1 className="text-4xl font-black tracking-tighter mb-2">Settings</h1>
                    <p className="text-sm text-muted-foreground font-medium">Manage your account settings</p>
                </div>

                <div className="space-y-6">
                    {/* Profile Information */}
                    <Card className="border-2 border-white/50 rounded-3xl overflow-hidden">
                        <CardContent className="p-6">
                            <h3 className="text-sm font-black uppercase tracking-wider text-primary mb-4">Profile Information</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-muted-foreground mb-2 block uppercase tracking-wider">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="pl-12 py-3 rounded-2xl border-2 font-bold"
                                            placeholder="Your name"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-muted-foreground mb-2 block uppercase tracking-wider">Username</label>
                                    <div className="relative">
                                        <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            className="pl-12 py-3 rounded-2xl border-2 font-bold"
                                            placeholder="username"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-muted-foreground mb-2 block uppercase tracking-wider">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="pl-12 py-3 rounded-2xl border-2 font-bold"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-muted-foreground mb-2 block uppercase tracking-wider">Bio</label>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-2xl border-2 border-muted/50 focus:border-primary outline-none font-medium text-sm resize-none"
                                        placeholder="Tell us about yourself..."
                                    />
                                </div>

                                <Button
                                    onClick={handleSaveProfile}
                                    className="w-full h-12 rounded-2xl font-bold"
                                >
                                    Save Profile
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Change Password */}
                    <Card className="border-2 border-white/50 rounded-3xl overflow-hidden">
                        <CardContent className="p-6">
                            <h3 className="text-sm font-black uppercase tracking-wider text-primary mb-4">Change Password</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-muted-foreground mb-2 block uppercase tracking-wider">Current Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            type={showCurrentPassword ? "text" : "password"}
                                            name="currentPassword"
                                            value={formData.currentPassword}
                                            onChange={handleChange}
                                            className="pl-12 pr-12 py-3 rounded-2xl border-2 font-bold"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-muted-foreground mb-2 block uppercase tracking-wider">New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            type={showNewPassword ? "text" : "password"}
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            className="pl-12 pr-12 py-3 rounded-2xl border-2 font-bold"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-muted-foreground mb-2 block uppercase tracking-wider">Confirm New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="pl-12 py-3 rounded-2xl border-2 font-bold"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <Button
                                    onClick={handleChangePassword}
                                    variant="outline"
                                    className="w-full h-12 rounded-2xl font-bold border-2"
                                >
                                    Change Password
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Danger Zone */}
                    <Card className="border-2 border-red-200 rounded-3xl overflow-hidden mb-8">
                        <CardContent className="p-6 space-y-3">
                            <h3 className="text-sm font-black uppercase tracking-wider text-red-600 mb-4">Danger Zone</h3>

                            <Button
                                onClick={handleLogout}
                                variant="outline"
                                className="w-full h-12 rounded-2xl font-bold border-2 border-red-100 text-red-600 hover:bg-red-50"
                            >
                                <LogOut className="mr-2 h-4 w-4" /> Log Out
                            </Button>

                            <Button
                                variant="ghost"
                                className="w-full h-12 rounded-2xl font-bold text-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                                Delete Account
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
