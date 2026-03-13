import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import BuildPage from './pages/BuildPage'
import ExplorePage from './pages/ExplorePage'
import CapabilityDeployPage from './pages/CapabilityDeployPage'
import SettingsPage from './pages/SettingsPage'

function App() {
  return (
    <div className="min-h-screen bg-surface text-text">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/deploy" element={<CapabilityDeployPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="/build/:projectId?" element={<BuildPage />} />
      </Routes>
    </div>
  )
}

export default App
