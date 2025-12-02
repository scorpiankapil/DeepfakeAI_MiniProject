DeepGuard - AI-Powered Deepfake Detection
A modern React application built with Vite, TypeScript, and Tailwind CSS for detecting deepfakes and AI-generated content in images.

Features
🤖 Advanced AI-powered deepfake detection
🎨 Modern, responsive UI with dark/light theme support
📊 Detailed analysis with confidence scores
🚀 Real-time image processing simulation
🔒 Privacy-focused design
📱 Mobile-responsive interface
Tech Stack
React 18 with TypeScript
Vite for fast development and building
Tailwind CSS for styling
Radix UI components for accessibility
Lucide React for icons
shadcn/ui component library
Getting Started
Prerequisites
Node.js (version 16 or higher)
npm or yarn package manager
Installation
Clone or download the project files
Navigate to the project directory:
bash
cd deepguard-app
Install dependencies:
bash
npm install
Start the development server:
bash
npm run dev
Open your browser and visit http://localhost:8080
Available Scripts
npm run dev - Start development server
npm run build - Build for production
npm run build:dev - Build in development mode
npm run preview - Preview production build
npm run lint - Run ESLint
Project Structure
src/
├── components/
│   ├── ui/              # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── progress.tsx
│   │   └── badge.tsx
│   ├── deepfake-detector.tsx  # Main detection component
│   ├── header.tsx       # Header component
│   ├── footer.tsx       # Footer component
│   └── theme-provider.tsx     # Theme context provider
├── lib/
│   └── utils.ts         # Utility functions
├── App.tsx              # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles and CSS variables
Features Overview
Image Upload & Analysis
Drag-and-drop image upload
Support for JPG, PNG, and WebP formats
Real-time analysis progress tracking
Detection Results
Overall authenticity assessment
Detailed analysis breakdown:
Face manipulation detection
AI generation analysis
Image quality assessment
Metadata validation
Confidence scoring
Visual indicators and warnings
User Interface
Clean, modern design
Dark/light theme toggle
Responsive layout for all devices
Accessible components
Smooth animations and transitions
Customization
Theming
The application uses CSS custom properties for theming. You can customize colors by modifying the variables in src/index.css.

Components
All UI components are built with Radix UI primitives and can be customized through the component files in src/components/ui/.

Note
This is a demonstration application. The deepfake detection results are simulated for UI/UX purposes. In a real-world application, you would integrate with actual AI/ML services for deepfake detection.

License
This project is for educational and demonstration purposes.

