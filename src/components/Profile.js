
import React, { useState } from 'react'

function Profile({ customer }) {
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    address: customer?.address || '',
  })
  const [saved, setSaved] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSave = (e) => {
    e.preventDefault()
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '32px 0' }}>
      <div className="container">

        <div className="mb-4">
          <h1 style={{ fontWeight: '800', color: '#1a1a2e', fontSize: '28px', margin: '0 0 4px 0' }}>👤 My Profile</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: '0' }}>Manage your account details and preferences</p>
        </div>

        {saved && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '14px 20px', marginBottom: '20px', color: '#15803d', fontWeight: '600', fontSize: '14px' }}>
            ✅ Profile updated successfully!
          </div>
        )}

        <div className="row g-4">
          <div className="col-md-4">
            <div style={{ background: 'white', borderRadius: '20px', padding: '32px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
              <div style={{ width: '90px', height: '90px', background: 'linear-gradient(135deg, #f5a623, #f7c66b)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '36px', fontWeight: '800', color: '#1a1a2e' }}>
                {customer?.name?.charAt(0).toUpperCase()}
              </div>
              <h3 style={{ fontWeight: '800', color: '#1a1a2e', margin: '0 0 4px 0', fontSize: '20px' }}>{customer?.name}</h3>
              <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 16px 0' }}>{customer?.email}</p>
              <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>✅ Active Account</span>

              <div style={{ marginTop: '24px', padding: '16px', background: '#f8fafc', borderRadius: '12px', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '13px', color: '#6b7280' }}>Customer ID</span>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#1a1a2e' }}>{customer?.id}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '13px', color: '#6b7280' }}>kWh Balance</span>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#f5a623' }}>{customer?.kWh} kWh</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: '#6b7280' }}>Account Type</span>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#1a1a2e' }}>Residential</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-8">
            <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 style={{ fontWeight: '700', color: '#1a1a2e', margin: '0' }}>📋 Personal Information</h4>
                <button
                  onClick={() => setEditing(!editing)}
                  style={{ background: editing ? '#fef2f2' : '#f8fafc', color: editing ? '#ef4444' : '#374151', border: `1px solid ${editing ? '#fecaca' : '#e2e8f0'}`, padding: '8px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}
                >
                  {editing ? '✕ Cancel' : '✏️ Edit Profile'}
                </button>
              </div>

              {editing ? (
                <form onSubmit={handleSave}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label style={{ fontWeight: '600', fontSize: '13px', color: '#374151', display: 'block', marginBottom: '6px' }}>Full Name</label>
                      <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} style={{ padding: '11px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '14px' }} />
                    </div>
                    <div className="col-md-6">
                      <label style={{ fontWeight: '600', fontSize: '13px', color: '#374151', display: 'block', marginBottom: '6px' }}>Email Address</label>
                      <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} style={{ padding: '11px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '14px' }} />
                    </div>
                    <div className="col-md-6">
                      <label style={{ fontWeight: '600', fontSize: '13px', color: '#374151', display: 'block', marginBottom: '6px' }}>Phone Number</label>
                      <input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleChange} style={{ padding: '11px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '14px' }} />
                    </div>
                    <div className="col-md-6">
                      <label style={{ fontWeight: '600', fontSize: '13px', color: '#374151', display: 'block', marginBottom: '6px' }}>Customer ID</label>
                      <input type="text" className="form-control" value={customer?.id} disabled style={{ padding: '11px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '14px', background: '#f8fafc', color: '#9ca3af' }} />
                    </div>
                    <div className="col-12">
                      <label style={{ fontWeight: '600', fontSize: '13px', color: '#374151', display: 'block', marginBottom: '6px' }}>Address</label>
                      <textarea name="address" className="form-control" rows="3" value={formData.address} onChange={handleChange} style={{ padding: '11px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '14px' }} />
                    </div>
                    <div className="col-12">
                      <button type="submit" style={{ background: 'linear-gradient(135deg, #f5a623, #f7c66b)', color: '#1a1a2e', fontWeight: '700', padding: '13px 32px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '14px' }}>
                        💾 Save Changes
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="row g-3">
                  {[
                    { label: 'Full Name', value: formData.name, icon: '👤' },
                    { label: 'Email Address', value: formData.email, icon: '📧' },
                    { label: 'Phone Number', value: formData.phone, icon: '📱' },
                    { label: 'Customer ID', value: customer?.id, icon: '🪪' },
                    { label: 'Address', value: formData.address, icon: '📍', full: true },
                  ].map((item, i) => (
                    <div key={i} className={item.full ? 'col-12' : 'col-md-6'}>
                      <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px' }}>
                        <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0 0 4px 0', fontWeight: '600' }}>{item.icon} {item.label}</p>
                        <p style={{ fontSize: '14px', color: '#1a1a2e', margin: '0', fontWeight: '600' }}>{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ background: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', marginTop: '20px' }}>
              <h4 style={{ fontWeight: '700', color: '#1a1a2e', margin: '0 0 20px 0', fontSize: '16px' }}>🔒 Account Security</h4>
              <div className="d-flex flex-column gap-3">
                {[
                  { label: 'Two-Factor Authentication', status: 'Enabled', color: '#10b981', bg: '#f0fdf4', icon: '🛡️' },
                  { label: 'Email Notifications', status: 'Enabled', color: '#10b981', bg: '#f0fdf4', icon: '📬' },
                  { label: 'SMS Alerts', status: 'Disabled', color: '#9ca3af', bg: '#f8fafc', icon: '📱' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: '#f8fafc', borderRadius: '10px' }}>
                    <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>{item.icon} {item.label}</span>
                    <span style={{ background: item.bg, color: item.color, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Profile;