import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/noto-sans-bengali'
import './index.css'
import App from './App.jsx'

try {
  const root = document.getElementById('root')
  if (!root) {
    console.error('Root element not found!')
  } else {
    createRoot(root).render(
      <StrictMode>
        <App />
      </StrictMode>
    )
    console.log('App successfully rendered')
  }
} catch (error) {
  console.error('Error rendering app:', error)
  document.body.innerHTML = `
    <div style="padding: 50px; color: red; font-family: sans-serif;">
      <h1>Error Loading Application</h1>
      <pre>${error.message}\n\n${error.stack}</pre>
    </div>
  `
}
