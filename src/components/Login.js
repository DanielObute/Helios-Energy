import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const defaultCustomers = [
  { id: 'HE-001', name: 'Obute Daniel', email: 'obutedaniel2@gmail.com', phone: '+90 533 001 0001', address: '12 Kyrenia Street, Nicosia, North Cyprus', kWh: 450, cardNumber: '**** **** **** 1234', joinDate: '2026-01-15', purchases: [{ date: '2026-08-01', kWh: 200, amount: 500 }] },
  { id: 'HE-002', name: 'Alex Morgan', email: 'alex@gmail.com', phone: '+90 533 002 0002', address: '5 Famagusta Road, Kyrenia, North Cyprus', kWh: 120, cardNumber: '**** **** **** 5678', joinDate: '2026-02-20', purchases: [{ date: '2026-07-15', kWh: 100, amount: 250 }] },
  { id: 'HE-003', name: 'Sarah Williams', email: 'sarah@gmail.com', phone: '+90 533 003 0003', address: '8 Lefke Avenue, Morfou, North Cyprus', kWh: 30, cardNumber: '**** **** **** 9012', joinDate: '2026-03-10', purchases: [] },
]

const ADMIN = {
  email: 'admin@helios.com',
  password: 'helios2025',
  name: 'Helios Admin'
}

function Login({ setIsLoggedIn, setCustomer, setIsAdmin }) {
  const [step, setStep] = useState('email')
  const [emailOrId, setEmailOrId] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isNewCustomer, setIsNewCustomer] = useState(false)
  const [foundCustomer, setFoundCustomer] = useState(null)
  const [registerData, setRegisterData] = useState({ name: '', phone: '', address: '' })
  const [customers, setCustomers] = useState([])
  const navigate = useNavigate()

  // Load customers from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('helios_customers')
    if (stored) {
      setCustomers(JSON.parse(stored))
    } else {
      localStorage.setItem('helios_customers', JSON.stringify(defaultCustomers))
      setCustomers(defaultCustomers)
    }
  }, [])

  const generateCustomerId = (allCustomers) => {
    const num = allCustomers.length + 1
    return `HE-${String(num).padStart(3, '0')}`
  }

  const handleEmailSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
  
    setTimeout(() => {
      const input = emailOrId.trim().toLowerCase()
  
      // Check admin
      if (input === ADMIN.email.toLowerCase()) {
        setIsNewCustomer(false)
        setFoundCustomer({ isAdmin: true })
        setStep('adminPassword')
        setLoading(false)
        return
      }
  
      // ALWAYS read fresh from localStorage — never use state
      const allCustomers = JSON.parse(localStorage.getItem('helios_customers') || '[]')
  
      const found = allCustomers.find(c =>
        c.email.toLowerCase() === input ||
        c.id.toLowerCase() === input
      )
  
      if (found) {
        setFoundCustomer(found)
        setIsNewCustomer(false)
        setStep('login')
      } else {
        if (input.startsWith('he-')) {
          setError('Customer ID not found. Please check your ID or use your registered email.')
          setLoading(false)
          return
        }
        setIsNewCustomer(true)
        setStep('register')
      }
      setLoading(false)
    }, 1500)
  }

  const handleAdminLogin = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      if (password === ADMIN.password) {
        setIsAdmin(true)
        setIsLoggedIn(true)
        navigate('/admin')
      } else {
        setError('Incorrect admin password')
      }
      setLoading(false)
    }, 1500)
  }

  const handleLogin = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      // Refresh customer data from localStorage
      const allCustomers = JSON.parse(localStorage.getItem('helios_customers') || '[]')
      const updated = allCustomers.find(c => c.id === foundCustomer.id)
      setCustomer(updated || foundCustomer)
      setIsAdmin(false)
      setIsLoggedIn(true)
      navigate('/dashboard')
      setLoading(false)
    }, 1500)
  }

  const handleRegister = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      const allCustomers = JSON.parse(localStorage.getItem('helios_customers') || '[]')
  
      // Double check email doesn't already exist
      const alreadyExists = allCustomers.find(c =>
        c.email.toLowerCase() === emailOrId.trim().toLowerCase()
      )
  
      if (alreadyExists) {
        setFoundCustomer(alreadyExists)
        setIsNewCustomer(false)
        setStep('login')
        setLoading(false)
        return
      }
  
      const newId = generateCustomerId(allCustomers)
      const newCustomer = {
        id: newId,
        name: registerData.name,
        email: emailOrId.trim().toLowerCase(),
        phone: registerData.phone,
        address: registerData.address,
        kWh: 0,
        cardNumber: '**** **** **** 0000',
        joinDate: new Date().toISOString().split('T')[0],
        purchases: []
      }
      const updated = [...allCustomers, newCustomer]
      localStorage.setItem('helios_customers', JSON.stringify(updated))
      setCustomer(newCustomer)
      setIsAdmin(false)
      setIsLoggedIn(true)
      navigate('/dashboard')
      setLoading(false)
    }, 1500)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>

        <div className="text-center mb-4">
          <div style={{ fontSize: '64px', marginBottom: '12px' }}>☀️</div>
          <h1 style={{ color: '#f5a623', fontWeight: '800', fontSize: '32px', margin: '0' }}>Helios Energy</h1>
          <p style={{ color: '#a0aec0', fontSize: '14px', marginTop: '6px' }}>North Cyprus Utility Provider</p>
        </div>

        <div style={{ background: 'white', borderRadius: '20px', padding: '36px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>

          {/* STEP 1 — Email or Customer ID */}
          {step === 'email' && (
            <>
              <h2 style={{ fontWeight: '700', color: '#1a1a2e', marginBottom: '6px', fontSize: '22px' }}>Welcome</h2>
              <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '24px' }}>Enter your email or Customer ID to get started</p>
              <form onSubmit={handleEmailSubmit}>
                <div className="mb-3">
                  <label style={{ fontWeight: '600', fontSize: '13px', color: '#374151', display: 'block', marginBottom: '6px' }}>Email Address or Customer ID</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="you@example.com or HE-001"
                    value={emailOrId}
                    onChange={e => { setEmailOrId(e.target.value); setError('') }}
                    required
                    style={{ padding: '12px 16px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '14px' }}
                  />
                  <small style={{ color: '#9ca3af', fontSize: '11px' }}>Existing customers can use their Customer ID (e.g. HE-001)</small>
                </div>
                {error && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>⚠️ {error}</div>}
                <button type="submit" disabled={loading || !emailOrId} style={{ width: '100%', background: !emailOrId ? '#e2e8f0' : 'linear-gradient(135deg, #f5a623, #f7c66b)', color: !emailOrId ? '#9ca3af' : '#1a1a2e', fontWeight: '700', padding: '13px', borderRadius: '10px', fontSize: '15px', border: 'none', cursor: !emailOrId ? 'not-allowed' : 'pointer' }}>
                  {loading ? '⏳ Checking...' : 'Continue →'}
                </button>
              </form>
            </>
          )}

          {/* STEP 2 — Admin Password */}
          {step === 'adminPassword' && (
            <>
              <div style={{ background: '#1a1a2e', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>🛡️</span>
                <div>
                  <p style={{ margin: '0', fontWeight: '700', color: '#f5a623', fontSize: '14px' }}>Admin Access</p>
                  <p style={{ margin: '0', color: '#64748b', fontSize: '12px' }}>Enter your admin password</p>
                </div>
              </div>
              <form onSubmit={handleAdminLogin}>
                <div className="mb-3">
                  <label style={{ fontWeight: '600', fontSize: '13px', color: '#374151', display: 'block', marginBottom: '6px' }}>Admin Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError('') }}
                    required
                    style={{ padding: '12px 16px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '14px' }}
                  />
                </div>
                {error && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>⚠️ {error}</div>}
                <button type="submit" disabled={loading || !password} style={{ width: '100%', background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', color: 'white', fontWeight: '700', padding: '13px', borderRadius: '10px', fontSize: '15px', border: 'none', cursor: 'pointer', marginBottom: '12px' }}>
                  {loading ? '⏳ Verifying...' : '🛡️ Access Admin Panel'}
                </button>
                <button type="button" onClick={() => { setStep('email'); setEmailOrId(''); setError('') }} style={{ width: '100%', background: 'none', border: '1px solid #e2e8f0', color: '#6b7280', fontWeight: '600', padding: '11px', borderRadius: '10px', fontSize: '14px', cursor: 'pointer' }}>
                  ← Go Back
                </button>
              </form>
            </>
          )}

          {/* STEP 2A — Existing Customer */}
          {step === 'login' && foundCustomer && (
            <>
              <div style={{ background: '#f0fdf4', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', background: '#f5a623', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#1a1a2e', fontSize: '18px', flexShrink: 0 }}>
                  {foundCustomer.name.charAt(0)}
                </div>
                <div>
                  <p style={{ margin: '0', fontWeight: '700', color: '#1a1a2e', fontSize: '14px' }}>Welcome back, {foundCustomer.name.split(' ')[0]}!</p>
                  <p style={{ margin: '0', color: '#6b7280', fontSize: '12px' }}>ID: {foundCustomer.id} · {foundCustomer.email}</p>
                </div>
              </div>
              <h2 style={{ fontWeight: '700', color: '#1a1a2e', marginBottom: '6px', fontSize: '20px' }}>Sign In</h2>
              <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '20px' }}>Account found. Click below to access your dashboard.</p>
              <form onSubmit={handleLogin}>
                <button type="submit" disabled={loading} style={{ width: '100%', background: 'linear-gradient(135deg, #f5a623, #f7c66b)', color: '#1a1a2e', fontWeight: '700', padding: '13px', borderRadius: '10px', fontSize: '15px', border: 'none', cursor: 'pointer', marginBottom: '12px' }}>
                  {loading ? '⏳ Signing in...' : '⚡ Access My Account'}
                </button>
                <button type="button" onClick={() => { setStep('email'); setEmailOrId(''); setFoundCustomer(null) }} style={{ width: '100%', background: 'none', border: '1px solid #e2e8f0', color: '#6b7280', fontWeight: '600', padding: '11px', borderRadius: '10px', fontSize: '14px', cursor: 'pointer' }}>
                  ← Use different email / ID
                </button>
              </form>
            </>
          )}

          {/* STEP 2B — New Customer Register */}
          {step === 'register' && (
            <>
              <div style={{ background: '#fffbeb', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px' }}>
                <p style={{ margin: '0', fontWeight: '600', color: '#92400e', fontSize: '13px' }}>✨ New to Helios Energy</p>
                <p style={{ margin: '2px 0 0', color: '#92400e', fontSize: '12px' }}>{emailOrId} — Let's set up your account</p>
              </div>
              <h2 style={{ fontWeight: '700', color: '#1a1a2e', marginBottom: '6px', fontSize: '20px' }}>Create Account</h2>
              <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '20px' }}>You'll receive a Customer ID after registration</p>
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label style={{ fontWeight: '600', fontSize: '13px', color: '#374151', display: 'block', marginBottom: '6px' }}>Full Name</label>
                  <input type="text" className="form-control" placeholder="John Doe" value={registerData.name} onChange={e => setRegisterData({ ...registerData, name: e.target.value })} required style={{ padding: '11px 16px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '14px' }} />
                </div>
                <div className="mb-3">
                  <label style={{ fontWeight: '600', fontSize: '13px', color: '#374151', display: 'block', marginBottom: '6px' }}>Phone Number</label>
                  <input type="text" className="form-control" placeholder="+90 533 000 0000" value={registerData.phone} onChange={e => setRegisterData({ ...registerData, phone: e.target.value })} required style={{ padding: '11px 16px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '14px' }} />
                </div>
                <div className="mb-3">
                  <label style={{ fontWeight: '600', fontSize: '13px', color: '#374151', display: 'block', marginBottom: '6px' }}>Address</label>
                  <input type="text" className="form-control" placeholder="Street, City, North Cyprus" value={registerData.address} onChange={e => setRegisterData({ ...registerData, address: e.target.value })} required style={{ padding: '11px 16px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '14px' }} />
                </div>
                <button type="submit" disabled={loading} style={{ width: '100%', background: 'linear-gradient(135deg, #f5a623, #f7c66b)', color: '#1a1a2e', fontWeight: '700', padding: '13px', borderRadius: '10px', fontSize: '15px', border: 'none', cursor: 'pointer', marginBottom: '12px' }}>
                  {loading ? '⏳ Creating account...' : '☀️ Create My Account'}
                </button>
                <button type="button" onClick={() => { setStep('email'); setEmailOrId('') }} style={{ width: '100%', background: 'none', border: '1px solid #e2e8f0', color: '#6b7280', fontWeight: '600', padding: '11px', borderRadius: '10px', fontSize: '14px', cursor: 'pointer' }}>
                  ← Use different email
                </button>
              </form>
            </>
          )}
        </div>

        <p style={{ textAlign: 'center', color: '#4a5568', fontSize: '12px', marginTop: '24px' }}>
          © 2025 Helios Energy. All rights reserved. North Cyprus
        </p>
      </div>
    </div>
  )
}

export default Login