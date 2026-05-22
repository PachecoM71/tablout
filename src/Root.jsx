import { useState } from 'react'
import App from './App.jsx'
import LandingPage from './components/LandingPage.jsx'

export default function Root() {
  const [showApp, setShowApp] = useState(() => {
    const hasData = localStorage.getItem('tablout-storage')
    const wantsApp = window.location.hash === '#app'
    return !!(hasData || wantsApp)
  })

  if (showApp) {
    return <App />
  }

  return <LandingPage onEnterApp={() => { window.location.hash = 'app'; setShowApp(true) }} />
}
