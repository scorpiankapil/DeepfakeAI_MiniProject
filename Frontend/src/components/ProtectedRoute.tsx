import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getToken } from '../lib/utils'; // Import your utility function

/**
 * A component wrapper that protects routes from unauthenticated access.
 * If no token is found, it redirects the user to the Sign In page.
 */
const ProtectedRoute: React.FC = () => {
    // Check if the JWT token exists in local storage
    const isAuthenticated = !!getToken(); 

    if (!isAuthenticated) {
        // If not authenticated, redirect them to the /signin page
        // 'replace: true' ensures the history stack is cleared
        return <Navigate to="/signin" replace={true} />;
    }

    // If authenticated, render the nested route components (the main content)
    return <Outlet />;
};

export default ProtectedRoute;