import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./i18n"
import './index.css'
import './singleton/cursorSingleton.js'
import App from './App.jsx'
import { UserBehaviourTestProvidor } from './components/UserBehaviourTest.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserBehaviourTestProvidor>
      <App/>
    </UserBehaviourTestProvidor>
  </StrictMode>,
)
