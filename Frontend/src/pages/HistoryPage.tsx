// src/pages/HistoryPage.tsx
import React from "react";

interface HistoryPageProps {
  history: any[];
  onSelect: (item: any) => void;
}

const HistoryPage: React.FC<HistoryPageProps> = ({ history, onSelect }) => {
  if (!history || history.length === 0) {
    return <p className="text-center text-gray-400 mt-10">No analysis history yet.</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Analysis History</h2>

      <div className="space-y-4">
        {history.map((item) => (
          <div
            key={item._id}
            className="flex items-center justify-between bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition"
            onClick={() => onSelect(item)}
          >
            <div>
              <p className="text-white text-sm font-medium">
                {new Date(item.analysisDate).toLocaleString()}
              </p>
              <p className="text-gray-400 text-xs">
                Confidence: {item.resultData?.confidence ?? "N/A"}%
              </p>
            </div>

            <img
              src={item.imageUrl}
              alt="Analyzed"
              className="w-16 h-16 rounded-md object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPage;
