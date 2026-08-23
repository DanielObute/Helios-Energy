
import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

function Navbar({ setIsLoggedIn, customer }) {
  const navigate = useNavigate()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false)
    setIsLoggedIn(false)
    navigate('/')
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg" style={{ background: 'linear-gradient(135deg, #f5a623, #f7c66b)', boxShadow: '0 2px 10px rgba(0,0,0,0.15)', padding: '0 24px' }}>

        {/* LOGO */}
        <NavLink to="/dashboard" className="navbar-brand d-flex align-items-center gap-2" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: '22px' }}>☀️</span>
          <span style={{ fontWeight: '800', fontSize: '17px', color: '#1a1a2e' }}>Helios Energy</span>
        </NavLink>

        {/* Mobile Toggle */}
        <button className="navbar-toggler border-0" type="button" onClick={() => setMenuOpen(!menuOpen)} style={{ boxShadow: 'none' }}>
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`}>

          {/* CENTER Nav Links */}
          <ul className="navbar-nav mx-auto gap-1">
            {[
              { path: '/dashboard', label: '📊 Dashboard' },
              { path: '/buy-electricity', label: '⚡ Buy Electricity' },
              { path: '/appliance-tracker', label: '🏠 Appliance Tracker' },
              { path: '/payment', label: '💳 Payment' },
              { path: '/profile', label: '👤 Profile' },
            ].map((item, i) => (
              <li key={i} className="nav-item">
                <NavLink
                  to={item.path}
                  style={({ isActive }) => ({
                    display: 'block',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '13px',
                    textDecoration: 'none',
                    color: isActive ? 'white' : '#1a1a2e',
                    background: isActive ? '#1a1a2e' : 'transparent',
                    transition: 'all 0.15s',
                    whiteSpace: 'nowrap'
                  })}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* RIGHT — User + Logout */}
          <div className="d-flex align-items-center gap-2 ms-auto">
            <div style={{ width: '32px', height: '32px', background: '#1a1a2e', color: '#f5a623', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '13px', flexShrink: 0 }}>
              {customer?.name?.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontWeight: '700', color: '#1a1a2e', fontSize: '13px', whiteSpace: 'nowrap' }}>
              {customer?.name}
            </span>
            <button
              onClick={() => setShowLogoutModal(true)}
              style={{ background: '#1a1a2e', color: 'white', border: 'none', padding: '7px 14px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap', marginLeft: '8px' }}
            >
              Logout
            </button>
          </div>

        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '36px', maxWidth: '400px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', animation: 'fadeIn 0.2s ease' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>👋</div>
            <h3 style={{ fontWeight: '800', color: '#1a1a2e', marginBottom: '8px', fontSize: '22px' }}>Logging Out?</h3>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '28px' }}>
              Are you sure you want to log out of your Helios Energy account, <strong>{customer?.name?.split(' ')[0]}</strong>?
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowLogoutModal(false)}
                style={{ flex: 1, background: '#f8fafc', color: '#374151', border: '1px solid #e2e8f0', padding: '13px', borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}
              >
                Stay Logged In
              </button>
              <button
                onClick={handleLogoutConfirm}
                style={{ flex: 1, background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white', border: 'none', padding: '13px', borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar