import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { initTheme } from './utils/theme'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import './css/style.css'

// Initialize theme on app load
initTheme()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

