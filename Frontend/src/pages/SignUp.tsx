import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Camera } from 'lucide-react'; 
import { Card } from '../components/ui/card.tsx'; 
import { Button } from '../components/ui/button.tsx'; 
import { AlertTriangle } from 'lucide-react';

const SignUp: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    // State to hold the selected image file and its preview URL
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    
    const navigate = useNavigate();

    /**
     * Handles file selection for the avatar, stores the File object, and sets up the preview URL.
     */
    const handleAvatarChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        const file = e.target.files?.[0];
        if (file && file.type.substring(0, 5) === 'image') {
            setAvatarFile(file);
            // Create a local URL for the image preview
            const previewUrl = URL.createObjectURL(file);
            setAvatarPreview(previewUrl);
        } else {
            setAvatarFile(null);
            setAvatarPreview(null);
            if (file) { 
                setError('Please select a valid image file for your avatar (JPG/PNG).');
            }
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        // --- Client-side validation ---
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be 6 characters or longer.");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);
            
            if (avatarFile) {
                formData.append('avatar', avatarFile); 
            }

            const response = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                body: formData, 
            });

            const data: { token?: string, msg?: string, avatarUrl?: string } = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || 'Registration failed');
            }

            if (data.token) {
                localStorage.setItem('deepfake-token', data.token);
                
                if (data.avatarUrl) {
                    localStorage.setItem('user-avatar', data.avatarUrl);
                }
                
                navigate('/'); 
            } else {
                // Since alert() is forbidden, a better pattern is setting an error state or redirecting.
                // Assuming successful signup but no token means temporary redirect to signin.
                navigate('/signin'); 
            }

        } catch (err: any) {
            console.error('Registration Error:', err);
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
            <div className="w-full max-w-md">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full mb-4 shadow-lg shadow-purple-500/50">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-gray-400">Join us to start detecting deepfakes</p>
                </div>

                {/* Card Container */}
                <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* --- AVATAR UPLOAD SECTION --- */}
                        <div className="flex justify-center">
                            <label 
                                htmlFor="avatar-upload" 
                                className="relative h-28 w-28 rounded-full cursor-pointer group transition-all"
                            >
                                {/* Avatar Image/Placeholder */}
                                {avatarPreview ? (
                                    <img 
                                        src={avatarPreview} 
                                        alt="Avatar Preview" 
                                        className="h-full w-full rounded-full object-cover border-4 border-gray-700 group-hover:border-purple-500 transition-all"
                                    />
                                ) : (
                                    <div className="h-full w-full rounded-full bg-gray-900 flex items-center justify-center text-gray-500 border-4 border-gray-700 group-hover:border-purple-500 transition-all">
                                        <User className="h-14 w-14" />
                                    </div>
                                )}
                                
                                {/* Overlay Camera Icon */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="h-8 w-8 text-white" />
                                </div>

                                {/* Badge */}
                                <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full p-2 shadow-lg">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>

                                {/* Hidden File Input */}
                                <input
                                    type="file"
                                    id="avatar-upload"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        <p className="text-center text-xs text-gray-500 -mt-2">Click to upload profile picture</p>
                        {/* ------------------------------------- */}

                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                </div>
                                <input 
                                    type="email" 
                                    id="email" 
                                    placeholder="user@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none placeholder-gray-500"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input 
                                    type="password" 
                                    id="password" 
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none placeholder-gray-500"
                                />
                            </div>
                        </div>

                        {/* Confirm Password Input */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <input 
                                    type="password" 
                                    id="confirmPassword" 
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none placeholder-gray-500"
                                />
                            </div>
                        </div>
                        
                        {/* Error Display */}
                        {error && (
                            <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3 flex items-start">
                                <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                                <p className="text-red-300 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Registering...
                                </span>
                            ) : (
                                'Create Account'
                            )}
                        </Button>
                    </form>

                    {/* Sign In Link */}
                    <div className="mt-6 pt-6 border-t border-gray-700">
                        <p className="text-center text-gray-400">
                            Already have an account?{' '}
                            <a href="/signin" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                                Sign In
                            </a>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-gray-500 mt-6">
                    By signing up, you agree to our Terms & Privacy Policy
                </p>
            </div>
        </div>
    );
};

export default SignUp;