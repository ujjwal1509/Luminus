import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import AppErrorBoundary from './components/AppErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppErrorBoundary>
      <HashRouter>
        <Suspense fallback={<div style={{ minHeight: '100vh', background: '#04030A' }} />}>
          <App />
        </Suspense>
      </HashRouter>
    </AppErrorBoundary>
  </StrictMode>,
)