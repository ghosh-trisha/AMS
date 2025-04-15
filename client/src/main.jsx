import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RoleProvider } from './components/contexts/roleContext.jsx'
import { SessionProvider } from './components/contexts/sessionContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RoleProvider>
      <SessionProvider>
        <App />
      </SessionProvider>
    </RoleProvider>
  </StrictMode>,
)
