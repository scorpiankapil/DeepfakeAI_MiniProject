import { useState, useCallback, useRef } from 'react' // Added useRef
import { Upload, Image as ImageIcon, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { makeAuthenticatedRequest } from '../lib/utils' // Your authenticated utility

import HistorySidebar from '../components/HistorySidebar';

// --- TYPE DEFINITIONS ---
type DetectionResult = {
    // These keys must match the JSON structure returned by your backend /api/analysis/detect route
    isDeepfake: boolean
    confidence: number
    analysis: {
        faceManipulation: number
        artificialGeneration: number
        imageQuality: number
        metadata: number
    }
}

export function DeepfakeDetector() {
    // State to hold the Base64 URL for display
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    // Ref to hold the actual File object for API upload
    const fileRef = useRef<File | null>(null)

    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [result, setResult] = useState<DetectionResult | null>(null)
    const [progress, setProgress] = useState(0)
    const [error, setError] = useState<string | null>(null) // New state for API errors
    const [selectedHistoryItem, setSelectedHistoryItem] = useState<any>(null);


    /**
     * Handles file selection, stores the File object, and sets up the preview URL.
     */
    const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        setError(null);
        if (file) {
            // 1. Store the actual File object in the ref for API use
            fileRef.current = file;

            // 2. Create the Base64 URL for immediate display
            const reader = new FileReader()
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string)
                setResult(null)
            }
            reader.readAsDataURL(file)
        }
    }, [])

    /**
     * Executes the actual authenticated analysis request to the backend.
     */
    const analyzeImage = useCallback(async () => {
        const file = fileRef.current;
        console.log('Starting analysis for file:', file);
        if (!file) {
            setError('Please upload an image first.');
            return;
        }

        setIsAnalyzing(true)
        setProgress(0)
        setError(null)

        // 1. Prepare data for file upload using FormData
        const formData = new FormData()
        formData.append('picture', file) // 'picture' must match the field name expected by your backend's multer middleware

        try {
            // --- Analysis Progress Simulation (still useful for UX) ---
            const steps = [
                { step: 'Loading image...', progress: 20 },
                { step: 'Analyzing facial features...', progress: 40 },
                { step: 'Checking for AI artifacts...', progress: 60 },
                { step: 'Validating metadata...', progress: 80 },
            ]

            // Run progress updates while the request is in flight
            const progressPromise = (async () => {
                for (const { progress: stepProgress } of steps) {
                    await new Promise(resolve => setTimeout(resolve, 300))
                    setProgress(stepProgress)
                }
            })();

            // --- Authenticated API Call ---
            const response = await makeAuthenticatedRequest(
                '/api/analysis/detect', // Your protected route
                'POST',
                formData // The FormData object
            );

            // Wait for progress simulation to catch up before setting final result
            await progressPromise;

            if (!response.ok) {
                // If response is not ok (but not 401, which is handled in utils),
                // it might be 400 or 500
                const errData = await response.json();
                throw new Error(errData.msg || 'Analysis failed with status ' + response.status);
            }

            const finalResult: DetectionResult = await response.json();

            // Set final progress and result
            setProgress(100);
            setResult(finalResult);

        } catch (err: any) {
            // makeAuthenticatedRequest handles 401 redirection, but other errors are caught here
            console.error('Analysis API Error:', err);
            setError(err.message || 'An unknown error occurred during analysis.');
            setProgress(0);
        } finally {
            setIsAnalyzing(false);
        }
    }, []) // image is no longer in the dependency array, using fileRef.current

    const resetAnalysis = () => {
        setImagePreview(null)
        fileRef.current = null // Clear the file reference
        setResult(null)
        setProgress(0)
        setIsAnalyzing(false)
        setError(null) // Clear any errors
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {!selectedHistoryItem ? (
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Hero Section */}
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold tracking-tight">Advanced Deepfake Detection</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Upload an image to analyze it for AI-generated content, face manipulation, and synthetic media using our cutting-edge detection algorithms.
                        </p>
                    </div>

                    {/* Upload Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Upload className="h-5 w-5" />
                                Upload Image for Analysis
                            </CardTitle>
                            <CardDescription>
                                Support for JPG, PNG, and WebP formats. Maximum file size: 10MB
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Error Alert Display */}
                            {error && (
                                <div className="flex items-center gap-3 p-3 mb-4 bg-red-100 text-red-700 rounded-lg border border-red-300">
                                    <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                                    <p className="text-sm font-medium">{error}</p>
                                </div>
                            )}

                            {!imagePreview ? (
                                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                                    <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                    <div className="space-y-2">
                                        <p className="text-sm text-muted-foreground">
                                            Drag and drop an image here, or click to select
                                        </p>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            id="image-upload"
                                        />
                                        <Button asChild>
                                            <label htmlFor="image-upload" className="cursor-pointer">
                                                Choose Image
                                            </label>
                                        </Button>
                                    </div>
                                </div>
                            ) : (




                                <div className="space-y-4">
                                    <img
                                        src={imagePreview}
                                        alt="Uploaded for analysis"
                                        className="max-w-full h-auto max-h-96 mx-auto rounded-lg border"
                                    />
                                    <div className="flex gap-2 justify-center">
                                        <Button onClick={analyzeImage} disabled={isAnalyzing}>
                                            {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
                                        </Button>
                                        <Button variant="outline" onClick={resetAnalysis}>
                                            Upload New Image
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Analysis Progress (unchanged) */}
                    {isAnalyzing && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Analysis in Progress</CardTitle>
                                <CardDescription>
                                    Running advanced AI detection algorithms...
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Progress value={progress} className="w-full" />
                                <p className="text-sm text-muted-foreground mt-2">
                                    {progress === 100 ? 'Finalizing report...' : `${progress}% complete`}
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Results (unchanged) */}
                    {result && !isAnalyzing && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    {result.isDeepfake ? (
                                        <XCircle className="h-5 w-5 text-destructive" />
                                    ) : (
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                    )}
                                    Detection Results
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Overall Result */}
                                <div className="flex items-center justify-between p-4 rounded-lg border">
                                    <div>
                                        <h3 className="font-semibold">
                                            {result.isDeepfake ? 'Potential Deepfake Detected' : 'Authentic Image'}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Confidence: {result.confidence}%
                                        </p>
                                    </div>
                                    <Badge variant={result.isDeepfake ? 'destructive' : 'default'}>
                                        {result.isDeepfake ? 'DEEPFAKE' : 'AUTHENTIC'}
                                    </Badge>
                                </div>

                                {/* Detailed Analysis */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <h4 className="font-medium">Face Manipulation Detection</h4>
                                        <Progress value={result.analysis.faceManipulation} />
                                        <p className="text-sm text-muted-foreground">
                                            {result.analysis.faceManipulation}% suspicious patterns
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="font-medium">AI Generation Analysis</h4>
                                        <Progress value={result.analysis.artificialGeneration} />
                                        <p className="text-sm text-muted-foreground">
                                            {result.analysis.artificialGeneration}% AI artifacts detected
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="font-medium">Image Quality Assessment</h4>
                                        <Progress value={result.analysis.imageQuality} />
                                        <p className="text-sm text-muted-foreground">
                                            {result.analysis.imageQuality}% quality score
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="font-medium">Metadata Validation</h4>
                                        <Progress value={result.analysis.metadata} />
                                        <p className="text-sm text-muted-foreground">
                                            {result.analysis.metadata}% authenticity score
                                        </p>
                                    </div>
                                </div>

                                {/* Warning */}
                                {result.isDeepfake && (
                                    <div className="flex items-start gap-3 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                                        <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                                        <div>
                                            <h4 className="font-medium text-destructive">Warning</h4>
                                            <p className="text-sm text-muted-foreground">
                                                This image shows signs of artificial manipulation or generation.
                                                Exercise caution when sharing or using this content.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Info Cards (unchanged) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">99%+ Accuracy</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    State-of-the-art AI models trained on millions of images for reliable detection.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Real-time Analysis</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Get instant results with our optimized detection algorithms and cloud processing.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Privacy Protected</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Images are analyzed securely and automatically deleted after processing.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            ) : (

                <div className="max-w-2xl mx-auto space-y-6">
                    <img
                        src={selectedHistoryItem.imageUrl}
                        alt="Analyzed Image"
                        className="rounded-lg shadow-md w-full object-contain border"
                    />
                    <div className="bg-card border p-5 rounded-lg shadow-sm space-y-2">
                        <h2 className="text-xl font-semibold">
                            {selectedHistoryItem.resultData.isDeepfake
                                ? 'AI-Generated Image Detected'
                                : 'Authentic Image'}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            <strong>Confidence:</strong>{' '}
                            {selectedHistoryItem.resultData.confidence}%
                        </p>
                        <p className="text-sm text-muted-foreground">
                            <strong>Analyzed on:</strong>{' '}
                            {new Date(selectedHistoryItem.analysisDate).toLocaleString()}
                        </p>
                    </div>

                    <Button variant="outline" onClick={() => setSelectedHistoryItem(null)}>
                        ← Back to Analyzer
                    </Button>
                </div>


            )}
        </div>
    )
}