import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// ------------------------------------------------------------------
// YOUR EXISTING CODE FOR CLASS MERGING
// ------------------------------------------------------------------
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ------------------------------------------------------------------
// NEW CODE FOR AUTHENTICATION UTILITIES
// ------------------------------------------------------------------

/**
 * Retrieves the JWT from storage.
 * @returns The token string or null if not found.
 */
export const getToken = (): string | null => {
    return localStorage.getItem('deepfake-token');
};

/**
 * Utility function to make authenticated GET/POST requests.
 * It automatically attaches the JWT header.
 */
export const makeAuthenticatedRequest = async (
  url: string,
  method: 'GET' | 'POST',
  body?: any
) => {
  const token = getToken();
  if (!token) {
    localStorage.removeItem('deepfake-token');
    window.location.href = '/signin';
    throw new Error('User is not authenticated. Redirecting to sign in.');
  }

  // Check if body is FormData (used for file uploads)
  const isFormData = body instanceof FormData;

  const headers: HeadersInit = {
    'x-auth-token': token, // ✅ keep this — your backend expects this
  };

  // Only set Content-Type manually for non-FormData bodies
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const config: RequestInit = {
    method,
    headers,
    body: body
      ? isFormData
        ? body // ✅ send FormData directly
        : JSON.stringify(body)
      : undefined,
  };

  const response = await fetch(`http://localhost:5000${url}`, config);
  console.log('Response status:', response.status);

  if (response.status === 401) {
    localStorage.removeItem('deepfake-token');
    window.location.href = '/signin';
    throw new Error('Session expired. Redirecting to sign in.');
  }

  return response;
};

export default {
  getToken,
  makeAuthenticatedRequest,
};