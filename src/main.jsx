import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Migrate data from old localStorage key to new one
try {
  const oldKey = 'seating-planner-storage'
  const newKey = 'tablout-storage'
  const oldData = localStorage.getItem(oldKey)
  if (oldData && !localStorage.getItem(newKey)) {
    localStorage.setItem(newKey, oldData)
  }
  localStorage.removeItem(oldKey)
} catch { /* ignore */ }

// Clear stale localStorage from previous app version
try {
  const stored = localStorage.getItem('tablout-storage')
  if (stored) {
    // Guard against corrupted or excessively large stored data (>5MB)
    if (stored.length > 5 * 1024 * 1024) {
      localStorage.removeItem('tablout-storage')
    } else {
      const parsed = JSON.parse(stored)
      if (!parsed.state || !Array.isArray(parsed.state.tables)) {
        localStorage.removeItem('tablout-storage')
      }
    }
  }
  localStorage.removeItem('sp-seats')
  localStorage.removeItem('sp-people')
  localStorage.removeItem('sp-event')
} catch {
  localStorage.removeItem('tablout-storage')
}

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(error) { return { error } }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, fontFamily: 'monospace', color: '#FF8C69', background: '#F5F4F0', minHeight: '100vh' }}>
          <h1 style={{ fontSize: 18, marginBottom: 12 }}>Something went wrong</h1>
          <p style={{ fontSize: 13, color: '#3A3A38' }}>The app encountered an unexpected error.</p>
          <button onClick={() => { localStorage.clear(); location.reload() }} style={{ marginTop: 20, padding: '8px 16px', background: '#1A3C2B', color: '#fff', border: 'none', cursor: 'pointer' }}>
            Clear Storage & Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
