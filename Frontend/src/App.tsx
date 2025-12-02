import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'
import { ThemeProvider } from './components/theme-provider'
import { Header } from './components/header'
import { Footer } from './components/footer'
import { DeepfakeDetector } from './components/deepfake-detector'
import ProtectedRoute from './components/ProtectedRoute'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import NotFound from './pages/NotFound'
import HistorySidebar from './components/HistorySidebar.tsx'
import HistoryDetails from './pages/HistoryDetails'
import HistoryPage from './pages/HistoryPage'
import api from './lib/utils'

// Helper function to check authentication
const isAuthenticated = () => !!localStorage.getItem('deepfake-token')

// 🧩 Layout component that receives onSelectItem prop
const MainLayout = ({ onSelectItem }: { onSelectItem: (item: any) => void }) => {
  const isUserAuthenticated = isAuthenticated()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar visible only when user is logged in */}
        {isUserAuthenticated && (
          <HistorySidebar onSelectItem={onSelectItem} />
        )}

        {/* Main content */}
        <main className={`flex-1 overflow-y-auto p-4 ${isUserAuthenticated ? 'md:pl-68' : ''}`}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}

function App() {
  const [historyData, setHistoryData] = useState<any[]>([])
  const [selectedItem, setSelectedItem] = useState<any | null>(null)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/api/analysis/history')
        setHistoryData(response.data)
      } catch (err) {
        console.error('Failed to fetch history:', err)
      }
    }

    fetchHistory()
  }, [])

  return (
    <Router>
      <ThemeProvider defaultTheme="dark" storageKey="deepguard-ui-theme">
        <Routes>
          <Route path="/" element={<MainLayout onSelectItem={setSelectedItem} />}>
            {/* Public routes */}
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route index element={<DeepfakeDetector />} />

              {/* History page */}
              <Route
                path="/history"
                element={<HistoryPage history={historyData} onSelect={setSelectedItem} />}
              />
              <Route
                path="/history/:id"
                element={<HistoryDetails selectedItem={selectedItem} />}
              />
            </Route>

            {/* Not found */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </Router>
  )
}

export default App
