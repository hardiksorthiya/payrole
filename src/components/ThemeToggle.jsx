import { useState, useEffect } from 'react'
import { getTheme, toggleTheme } from '../utils/theme'
import '../css/ThemeToggle.css'

/**
 * Theme Toggle Component
 * Button to switch between light and dark mode
 */
function ThemeToggle() {
  const [theme, setThemeState] = useState('light')

  useEffect(() => {
    // Initialize theme
    const currentTheme = getTheme()
    setThemeState(currentTheme)
    
    // Listen for theme changes
    const handleThemeChange = () => {
      setThemeState(getTheme())
    }
    
    // Listen for storage changes (if theme changes in another tab)
    window.addEventListener('storage', handleThemeChange)
    
    return () => {
      window.removeEventListener('storage', handleThemeChange)
    }
  }, [])

  const handleToggle = () => {
    const newTheme = toggleTheme()
    setThemeState(newTheme)
  }

  return (
    <button
      onClick={handleToggle}
      className="sorath-theme-toggle sorath-header-icon-btn"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <i className={`bi ${theme === 'light' ? 'bi-moon-fill' : 'bi-sun-fill'}`}></i>
    </button>
  )
}

export default ThemeToggle

