// backend/routes/analysis.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); 
const { upload } = require('../config/cloudinaryConfig'); // Your deepfake image upload config
const AnalysisHistory = require('../models/AnalysisHistory');


// @route   POST api/analysis/detect
// @desc    Upload picture, save to Cloudinary, and detect deepfake
// @access  Private (Requires authentication)
router.post(
    '/detect', 
    auth,   // 1. Authenticate user
    upload, // 2. Handle file upload (saves to Cloudinary and attaches info to req.file)
    async (req, res) => {
        console.log('req.file:', req.file);
        try {
            if (!req.file) {
                // This means the upload failed or no file was sent
                return res.status(400).json({ msg: 'No image file uploaded for analysis.' });
            }

            const imageUrl = req.file.path; // The Cloudinary URL
            
            console.log(`Deepfake analysis started for User ${req.user.id}. Image URL: ${imageUrl}`);
            
            // --- Placeholder Analysis Logic ---
            // In a real application, you call your deep learning model here, 
            // passing the imageUrl for processing.

            const analysisResult = {
                // Mock result structure that your frontend expects
                isDeepfake: Math.random() > 0.7, 
                confidence: Math.round(85 + Math.random() * 14),
                analysis: {
                    faceManipulation: Math.round(Math.random() * 100),
                    artificialGeneration: Math.round(Math.random() * 100),
                    imageQuality: Math.round(70 + Math.random() * 30),
                    metadata: Math.round(Math.random() * 100),
                },
            };

            const historyEntry = new AnalysisHistory({
                user: req.user.id,        // Set by the 'auth' middleware
                imageUrl: req.file.path,  // URL from Multer/Cloudinary
                resultData: {
                    isDeepfake: analysisResult.isDeepfake,
                    confidence: analysisResult.confidence
                },
            });
            await historyEntry.save();

            res.json(analysisResult);
            
        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Server error during analysis process.' });
        }
    }
);

router.get('/history', auth, async (req, res) => {
    try {
        const history = await AnalysisHistory.find({ user: req.user.id })
            .sort({ analysisDate: -1 }) // Sort by newest first
            .limit(20);                 // Limit to the last 20 entries
            
        res.json(history);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error fetching history');
    }
});

// routes/analysis.js
router.get('/history/:id', auth, async (req, res) => {
  try {
    const history = await AnalysisHistory.findById(req.params.id);
    if (!history) return res.status(404).json({ msg: 'Record not found' });
    res.json(history);
  } catch (err) {
    console.error('Error fetching analysis record:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});


module.exports = router;