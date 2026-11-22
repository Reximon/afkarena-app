import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/spectral/latin-400.css'
import '@fontsource/spectral/latin-500.css'
import '@fontsource/spectral/latin-600.css'
import '@fontsource-variable/manrope'
import '@fontsource-variable/jetbrains-mono'
import '@/i18n'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
