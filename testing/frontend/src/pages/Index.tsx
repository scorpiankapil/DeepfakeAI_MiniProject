import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ImageUpload from "@/components/ImageUpload";
import ResultsDisplay from "@/components/ResultsDisplay";
import EducationalSection from "@/components/EducationalSection";
import Footer from "@/components/Footer";

const Index = () => {
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleAnalysisComplete = (result: any) => {
    setAnalysisResult(result);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <div data-section="upload">
        <ImageUpload onAnalysisComplete={handleAnalysisComplete} />
      </div>
      <ResultsDisplay result={analysisResult} />
      <EducationalSection />
      <Footer />
    </div>
  );
};

export default Index;