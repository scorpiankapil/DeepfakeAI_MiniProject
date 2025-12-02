import React from 'react';
import { Badge } from "../components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";


import { AlertTriangle, CheckCircle, XCircle, Calendar } from 'lucide-react';

interface HistoryItem {
  _id: string;
  imageUrl: string;
  resultData: {
    isDeepfake: boolean;
    confidence: number;
  };
  analysisDate: string;
}

interface HistoryDetailsProps {
  item: HistoryItem | null;
}

const HistoryDetails: React.FC<HistoryDetailsProps> = ({  item }) => {
  if (!item) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        Select a history entry to view details.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">
          Analysis Details
        </h2>
        <Badge
          variant={item.resultData.isDeepfake ? 'destructive' : 'default'}
          className="text-xs px-3 py-1"
        >
          {item.resultData.isDeepfake ? 'DEEPFAKE' : 'AUTHENTIC'}
        </Badge>
      </div>

      {/* Image Preview */}
      <div className="w-full flex justify-center">
        <img
          src={item.imageUrl}
          alt="Analyzed"
          className="max-w-md rounded-xl shadow-lg border border-gray-300"
        />
      </div>

      {/* Info */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          <p className="text-sm text-muted-foreground">
            {new Date(item.analysisDate).toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {item.resultData.isDeepfake ? (
            <XCircle className="h-5 w-5 text-red-500" />
          ) : (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
          <p className="text-base font-medium">
            Confidence: {item.resultData.confidence}%
          </p>
        </div>

        {item.resultData.isDeepfake && (
          <div className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 rounded-lg p-2 text-sm">
            <AlertTriangle className="h-4 w-4" />
            <span>
              Warning: This image has a high probability of being AI-generated.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryDetails;
