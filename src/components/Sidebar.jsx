import { Nav } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import '../css/Sidebar.css'

function Sidebar({ isOpen }) {
  const location = useLocation()

  const menuItems = [
    {
      path: '/dashboard',
      icon: 'bi-speedometer2',
      label: 'Dashboard',
    },
    {
      path: '/employees',
      icon: 'bi-people',
      label: 'Employees',
    },
    {
      path: '/payroll',
      icon: 'bi-cash-stack',
      label: 'Payroll',
    },
    {
      path: '/attendance',
      icon: 'bi-calendar-check',
      label: 'Attendance',
    },
    {
      path: '/reports',
      icon: 'bi-graph-up',
      label: 'Reports',
    },
    {
      path: '/settings',
      icon: 'bi-gear',
      label: 'Settings',
    },
  ]

  return (
    <aside className={`sorath-sidebar ${isOpen ? 'sorath-sidebar-open' : 'sorath-sidebar-closed'}`}>
      {/* Logo Section */}
      <div className="sorath-sidebar-logo">
        <div className="sorath-sidebar-logo-icon">
          <i className="bi bi-wallet2"></i>
        </div>
        {isOpen && (
          <div className="sorath-sidebar-logo-text">
            <h2>Payroll</h2>
            <p>System</p>
          </div>
        )}
      </div>

      {/* Menu Section */}
      <nav className="sorath-sidebar-nav">
        <Nav className="sorath-sidebar-menu">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Nav.Item key={item.path}>
                <Link
                  to={item.path}
                  className={`sorath-menu-item ${isActive ? 'sorath-menu-item-active' : ''}`}
                  title={item.label}
                >
                  <i className={`bi ${item.icon}`}></i>
                  {isOpen && <span className="sorath-menu-label">{item.label}</span>}
                </Link>
              </Nav.Item>
            )
          })}
        </Nav>
      </nav>
    </aside>
  )
}

export default Sidebar

