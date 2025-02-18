import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./i18n"
import './index.css'
import './singleton/cursorSingleton.js'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
