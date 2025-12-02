import { Shield, LogOut, User } from "lucide-react"
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button'; 
import { getToken } from '../lib/utils';
import React, { useState, useEffect } from 'react'; // Added imports

// --- Simple Avatar Component for Header ---
const HeaderAvatar: React.FC = () => {
    // 1. Fetch the stored avatar URL
    const avatarUrl = localStorage.getItem('user-avatar');

    return (
        <div className="h-9 w-9 flex items-center justify-center rounded-full overflow-hidden border border-primary/20 bg-muted">
            {avatarUrl ? (
                // 2. Display the uploaded image
                <img 
                    src={avatarUrl} 
                    alt="User Avatar" 
                    className="h-full w-full object-cover"
                />
            ) : (
                // 3. Display the placeholder icon if no URL is found
                <User className="h-5 w-5 text-muted-foreground" />
            )}
        </div>
    );
};
// --- End Avatar Component ---


export function Header() {
    // ... (isAuthenticated, navigate, handleSignOut are the same)
    const isAuthenticated = !!getToken();
    const navigate = useNavigate();

    const handleSignOut = () => {
        localStorage.removeItem('deepfake-token');
        localStorage.removeItem('user-avatar'); // <--- Clear avatar on sign out
        navigate('/signin');
    };

    return (
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                
                {/* Logo and Title */}
                <Link to={isAuthenticated ? "/" : "/signin"} className="flex items-center space-x-2 cursor-pointer">
                    <Shield className="h-8 w-8 text-primary" />
                    <h1 className="text-2xl font-bold">DeepGuard</h1>
                </Link>
                
                {/* Tagline */}
                <p className="text-sm text-muted-foreground hidden md:block">
                    AI-Powered Deepfake Detection
                </p>

                {/* Authentication Controls & Profile */}
                <nav className="flex items-center space-x-4">
                    {isAuthenticated ? (
                        <>
                            <HeaderAvatar /> {/* <--- Using the dynamic avatar component */}
                            <Button 
                                variant="ghost" 
                                onClick={handleSignOut}
                                className="flex items-center gap-1"
                            >
                                <LogOut className="h-4 w-4" />
                                Sign Out
                            </Button>
                        </>
                    ) : (
                        // ... (Sign In/Sign Up buttons) ...
                        <>
                            <Button asChild variant="ghost">
                                <Link to="/signin">Sign In</Link>
                            </Button>
                            <Button asChild>
                                <Link to="/signup">Sign Up</Link>
                            </Button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    )
}