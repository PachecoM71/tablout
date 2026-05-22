import { useState } from 'react'
import App from './App.jsx'
import LandingPage from './components/LandingPage.jsx'

export default function Root() {
  const [showApp, setShowApp] = useState(() => {
    try {
      const raw = localStorage.getItem('tablout-storage')
      if (!raw) return window.location.hash === '#app'
      const parsed = JSON.parse(raw)
      // Validate expected structure before trusting it
      if (!parsed?.state || !Array.isArray(parsed.state.tables)) return false
      return true
    } catch {
      return window.location.hash === '#app'
    }
  })

  if (showApp) {
    return <App />
  }

  return <LandingPage onEnterApp={() => { window.location.hash = 'app'; setShowApp(true) }} />
}
