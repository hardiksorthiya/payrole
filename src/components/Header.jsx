import { useState, useRef, useEffect } from 'react'
import { Navbar, Nav, Dropdown } from 'react-bootstrap'
import ThemeToggle from './ThemeToggle'
import '../css/Header.css'

function Header({ toggleSidebar, sidebarOpen }) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <Navbar className="sorath-header">
      {/* Left side - Only Toggle Button */}
      <div className="sorath-header-left">
        <button
          className="sorath-hamburger-btn"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <i className={`bi ${sidebarOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
        </button>
      </div>

      {/* Right side - Notifications, Theme Toggle, Profile */}
      <div className="sorath-header-right">
        {/* Notification Icon */}
        <button className="sorath-header-icon-btn" aria-label="Notifications">
          <i className="bi bi-bell"></i>
          <span className="sorath-notification-badge">3</span>
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Profile Dropdown */}
        <div className="sorath-profile-dropdown" ref={dropdownRef}>
          <button
            className="sorath-profile-btn"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            aria-label="Profile menu"
          >
            <div className="sorath-profile-avatar">
              <i className="bi bi-person-circle"></i>
            </div>
            <span className="sorath-profile-name">John Doe</span>
            <i className="bi bi-chevron-down"></i>
          </button>

          {showProfileDropdown && (
            <div className="sorath-dropdown-menu">
              <a href="#" className="sorath-dropdown-item">
                <i className="bi bi-person"></i>
                <span>Profile</span>
              </a>
              <a href="#" className="sorath-dropdown-item">
                <i className="bi bi-gear"></i>
                <span>Settings</span>
              </a>
              <div className="sorath-dropdown-divider"></div>
              <a href="#" className="sorath-dropdown-item">
                <i className="bi bi-box-arrow-right"></i>
                <span>Logout</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </Navbar>
  )
}

export default Header

