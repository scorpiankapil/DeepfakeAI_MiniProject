import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'; 
import { makeAuthenticatedRequest } from '../lib/utils';
import { Badge } from './ui/badge'; 
import { Link } from 'react-router-dom'; // Added Link for potential future linking

// Define the structure of the data expected from the backend
interface HistoryItem {
    _id: string;
    imageUrl: string;
    resultData: {
        isDeepfake: boolean;
        confidence: number;
    };
    analysisDate: string; // ISO Date string
    // Add other fields from your AnalysisHistory model if needed
}

// Prop Definition: The sidebar needs to tell the parent which item was clicked
interface HistorySidebarProps {
    onSelectItem: (item: HistoryItem) => void;
}


const HistorySidebar: React.FC<HistorySidebarProps> = ({ onSelectItem }) => {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            // This is the protected route to fetch history for the current user
            const response = await makeAuthenticatedRequest('/api/analysis/history', 'GET');
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || `HTTP error! Status: ${response.status}`);
            }

            const data: HistoryItem[] = await response.json();
            setHistory(data);
            setError(null);
        } catch (err: any) {
            // makeAuthenticatedRequest handles 401 redirect, we handle others here
            // If the error is a SyntaxError (e.g., non-JSON response), we catch it here.
            setError("Failed to load history. Check backend console.");
            setHistory([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch history immediately on component mount
        fetchHistory();
    }, []); 

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            day: 'numeric',
            month: 'short'
        });
    };

    return (
        // The fixed sidebar container
        <aside className="w-64 bg-card border-r fixed h-full overflow-y-auto shadow-lg hidden md:block z-20">
            
            {/* Sidebar Header */}
            <div className="p-4 border-b flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Analysis History</h3>
            </div> 

            {/* History List Content */}
            <div className="p-2 space-y-2">
                
                {loading && <p className="text-center text-sm text-muted-foreground pt-4">Loading...</p>}
                
                {/* Error Display */}
                {error && (
                    <div className="p-2 flex items-center gap-2 text-sm text-red-500">
                        <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                        <p className="truncate">{error}</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && history.length === 0 && !error && (
                    <p className="text-center text-sm text-muted-foreground pt-4">No recent history found. Run a detection!</p>
                )}

                {/* List Items */}
                {history.map((item) => (
                    <div
                        key={item._id}
                        onClick={() => onSelectItem(item)} // Pass data back to parent
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer border border-transparent hover:border-primary/50"
                    >
                        {/* Thumbnail */}
                        <img
                            src={item.imageUrl}
                            alt="Analysis Thumbnail"
                            className="w-10 h-10 object-cover rounded-md flex-shrink-0" 
                        />

                        {/* Result Summary */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                                {formatDate(item.analysisDate)}
                            </p>
                            <Badge variant={item.resultData.isDeepfake ? 'destructive' : 'default'} className="mt-1 text-xs">
                                {item.resultData.isDeepfake ? 'DEEPFAKE' : 'AUTHENTIC'}
                            </Badge>
                        </div>

                        {/* Status Icon */}
                        <div className="text-xs text-muted-foreground flex-shrink-0">
                            {item.resultData.isDeepfake ? (
                                <XCircle className="h-4 w-4 text-destructive" />
                            ) : (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default HistorySidebar;