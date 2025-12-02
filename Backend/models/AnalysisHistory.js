const mongoose = require('mongoose');

const AnalysisHistorySchema = new mongoose.Schema({
    // Link the analysis to the user who requested it
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // The image uploaded to Cloudinary
    imageUrl: {
        type: String,
        required: true,
    },
    // Analysis results (stored as a sub-document or JSON)
    resultData: {
        isDeepfake: { type: Boolean, required: true },
        confidence: { type: Number, required: true },
        // You can store the detailed analysis structure here too, e.g.,
        // analysis: { type: Object }
    },
    // Timestamp for ordering the history
    analysisDate: {
        type: Date,
        default: Date.now,
    },
});




module.exports = mongoose.model('AnalysisHistory', AnalysisHistorySchema);