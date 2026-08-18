import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

function Navbar({ setIsLoggedIn, customer }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    setIsLoggedIn(false)
    navigate('/')
  }

  return (
    <nav style={{ background: 'linear-gradient(135deg, #f5a623, #f7c66b)', boxShadow: '0 2px 10px rgba(0,0,0,0.15)', padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

      {/* LEFT — Helios Energy Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '24px' }}>☀️</span>
        <span style={{ fontWeight: '800', fontSize: '18px', color: '#1a1a2e' }}>Helios Energy</span>
      </div>

      {/* CENTER — Navigation Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {[
          { path: '/dashboard', label: '📊 Dashboard' },
          { path: '/buy-electricity', label: '⚡ Buy Electricity' },
          { path: '/appliance-tracker', label: '🏠 Appliance Tracker' },
          { path: '/payment', label: '💳 Payment' },
          { path: '/profile', label: '👤 Profile' },
        ].map((item, i) => (
          <NavLink
            key={i}
            to={item.path}
            style={({ isActive }) => ({
              padding: '8px 14px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '13px',
              textDecoration: 'none',
              color: isActive ? 'white' : '#1a1a2e',
              background: isActive ? '#1a1a2e' : 'transparent',
              transition: 'all 0.15s'
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* RIGHT — User Info + Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '34px', height: '34px', background: '#1a1a2e', color: '#f5a623', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '14px', flexShrink: 0 }}>
          {customer?.name?.charAt(0).toUpperCase()}
        </div>
        <span style={{ fontWeight: '700', color: '#1a1a2e', fontSize: '14px', whiteSpace: 'nowrap' }}>
          {customer?.name}
        </span>
        <button
          onClick={handleLogout}
          style={{ background: '#1a1a2e', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          Logout
        </button>
      </div>

    </nav>
  )
}

export default Navbar