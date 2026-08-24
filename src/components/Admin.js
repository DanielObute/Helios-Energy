
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../Firebase'
import { collection, onSnapshot, updateDoc, deleteDoc, doc } from 'firebase/firestore'

function Admin({ setIsLoggedIn, setIsAdmin }) {
  const [customers, setCustomers] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const [editData, setEditData] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [toast, setToast] = useState('')
  const [loading, setLoading] = useState(true)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Real-time listener — fires automatically whenever any customer document
    // changes (new registration, new purchase, edit, delete), no refresh needed.
    const unsubscribe = onSnapshot(collection(db, 'customers'), (snapshot) => {
      const data = snapshot.docs.map(d => ({ docId: d.id, ...d.data() }))
      setCustomers(data)
      setLoading(false)
    }, (err) => {
      console.error('Error listening to customers:', err)
      setLoading(false)
    })

    // Stop listening when the component unmounts
    return () => unsubscribe()
  }, [])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const confirmLogout = () => {
    setIsLoggedIn(false)
    setIsAdmin(false)
    navigate('/')
  }

  const handleEdit = (customer) => {
    setEditData({ ...customer })
    setActiveTab('edit')
  }

  const handleSaveEdit = async () => {
    try {
      const customerRef = doc(db, 'customers', editData.docId)
      const { docId, ...dataToSave } = editData
      dataToSave.kWh = parseFloat(dataToSave.kWh) || 0
      await updateDoc(customerRef, dataToSave)
      // No need to manually reload — onSnapshot picks this up automatically
      setActiveTab('customers')
      setEditData(null)
      showToast('✅ Customer updated successfully')
    } catch (err) {
      console.error('Error updating customer:', err)
      showToast('❌ Failed to update customer')
    }
  }

  const handleDelete = async (docId, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}'s account?`)) {
      try {
        await deleteDoc(doc(db, 'customers', docId))
        if (activeTab === 'edit') setActiveTab('customers')
        showToast('🗑️ Customer deleted successfully')
      } catch (err) {
        console.error('Error deleting customer:', err)
        showToast('❌ Failed to delete customer')
      }
    }
  }

  const filtered = customers.filter(c =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.id?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalKwh = customers.reduce((sum, c) => sum + (c.kWh || 0), 0)
  const totalRevenue = customers.reduce((sum, c) => sum + (c.purchases?.reduce((s, p) => s + (p.amount || 0), 0) || 0), 0)
  const totalPurchases = customers.reduce((sum, c) => sum + (c.purchases?.length || 0), 0)
  const criticalCustomers = customers.filter(c => c.kWh < 50).length

  return (
    <div style={{ background: '#f0f4f8', minHeight: '100vh' }}>

      {/* Admin Navbar */}
      <nav style={{ background: '#1a1a2e', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px', boxShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>☀️</span>
          <div>
            <span style={{ color: '#f5a623', fontWeight: '800', fontSize: '16px' }}>Helios Energy</span>
            <span style={{ color: '#64748b', fontSize: '12px', marginLeft: '8px' }}>Admin Panel</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '5px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}>
            🟢 Live
          </span>
          <span style={{ background: '#ef4444', color: 'white', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>🛡️ ADMIN</span>
          <button onClick={() => setShowLogoutConfirm(true)} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>Logout</button>
        </div>
      </nav>

      <div className="container-fluid px-4 py-4">

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: 'white', padding: '6px', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', width: 'fit-content' }}>
          {[
            { key: 'overview', label: '📊 Overview' },
            { key: 'customers', label: '👥 Customers' },
            { key: 'purchases', label: '⚡ Purchases' },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '13px', background: activeTab === tab.key ? '#1a1a2e' : 'transparent', color: activeTab === tab.key ? 'white' : '#6b7280', transition: 'all 0.15s' }}>
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#6b7280' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
            <p style={{ fontWeight: '600' }}>Loading customer data from Firebase...</p>
          </div>
        ) : (
          <>
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div>
                <h2 style={{ fontWeight: '800', color: '#1a1a2e', marginBottom: '6px' }}>Dashboard Overview</h2>
                <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>Live data from Firebase — {customers.length} total customers</p>

                <div className="row g-3 mb-4">
                  {[
                    { label: 'Total Customers', value: customers.length, icon: '👥', color: '#3b82f6', bg: '#eff6ff' },
                    { label: 'Total kWh Distributed', value: `${totalKwh} kWh`, icon: '⚡', color: '#f5a623', bg: '#fffbeb' },
                    { label: 'Total Revenue', value: `₺${totalRevenue.toLocaleString()}`, icon: '💰', color: '#10b981', bg: '#ecfdf5' },
                    { label: 'Total Purchases', value: totalPurchases, icon: '🧾', color: '#8b5cf6', bg: '#f5f3ff' },
                    { label: 'Critical Accounts', value: criticalCustomers, icon: '🔴', color: '#ef4444', bg: '#fef2f2' },
                    { label: 'New This Month', value: customers.filter(c => c.joinDate?.startsWith(new Date().toISOString().slice(0, 7))).length, icon: '🆕', color: '#06b6d4', bg: '#ecfeff' },
                  ].map((item, i) => (
                    <div key={i} className="col-md-2 col-sm-4 col-6">
                      <div style={{ background: 'white', borderRadius: '14px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', textAlign: 'center' }}>
                        <div style={{ width: '44px', height: '44px', background: item.bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', margin: '0 auto 10px' }}>{item.icon}</div>
                        <h3 style={{ fontWeight: '800', color: item.color, fontSize: '22px', margin: '0 0 4px' }}>{item.value}</h3>
                        <p style={{ color: '#9ca3af', fontSize: '11px', margin: '0' }}>{item.label}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Critical Accounts Alert */}
                {criticalCustomers > 0 && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px' }}>
                    <h5 style={{ fontWeight: '700', color: '#991b1b', margin: '0 0 8px' }}>🔴 {criticalCustomers} Customer(s) with Critical Balance</h5>
                    <div className="d-flex flex-wrap gap-2">
                      {customers.filter(c => c.kWh < 50).map(c => (
                        <span key={c.docId} onClick={() => handleEdit(c)} style={{ background: '#ef4444', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                          {c.name} ({c.kWh} kWh)
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* All Customers Table */}
                <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  <h4 style={{ fontWeight: '700', color: '#1a1a2e', marginBottom: '16px', fontSize: '16px' }}>👥 All Registered Customers</h4>
                  <div className="table-responsive">
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                          {['Customer ID', 'Name', 'Email', 'Phone', 'kWh Balance', 'Join Date', 'Status', 'Action'].map(h => (
                            <th key={h} style={{ padding: '10px 12px', color: '#9ca3af', fontWeight: '600', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {customers.map((c, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                            <td style={{ padding: '12px', fontWeight: '700', color: '#f5a623', fontFamily: 'monospace' }}>{c.id}</td>
                            <td style={{ padding: '12px', fontWeight: '600', color: '#1a1a2e' }}>{c.name}</td>
                            <td style={{ padding: '12px', color: '#6b7280' }}>{c.email}</td>
                            <td style={{ padding: '12px', color: '#6b7280' }}>{c.phone}</td>
                            <td style={{ padding: '12px', fontWeight: '700', color: c.kWh < 50 ? '#ef4444' : c.kWh < 200 ? '#f59e0b' : '#10b981' }}>{c.kWh} kWh</td>
                            <td style={{ padding: '12px', color: '#9ca3af', fontSize: '12px' }}>{c.joinDate}</td>
                            <td style={{ padding: '12px' }}>
                              <span style={{ background: c.kWh < 50 ? '#fef2f2' : '#f0fdf4', color: c.kWh < 50 ? '#ef4444' : '#16a34a', padding: '3px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>
                                {c.kWh < 50 ? '⚠️ Critical' : '✓ Active'}
                              </span>
                            </td>
                            <td style={{ padding: '12px' }}>
                              <button onClick={() => handleEdit(c)} style={{ background: '#1a1a2e', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Manage</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* CUSTOMERS TAB */}
            {activeTab === 'customers' && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                  <div>
                    <h2 style={{ fontWeight: '800', color: '#1a1a2e', margin: '0 0 4px' }}>Customer Management</h2>
                    <p style={{ color: '#6b7280', fontSize: '14px', margin: '0' }}>{customers.length} total customers in Firebase</p>
                  </div>
                  <input
                    type="text"
                    placeholder="Search by name, email or ID..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{ padding: '10px 16px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '13px', width: '260px', outline: 'none' }}
                  />
                </div>

                <div className="row g-3">
                  {filtered.map((c, i) => (
                    <div key={i} className="col-md-6 col-lg-4">
                      <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: c.kWh < 50 ? '1px solid #fecaca' : '1px solid transparent' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '44px', height: '44px', background: 'linear-gradient(135deg, #f5a623, #f7c66b)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: '#1a1a2e', fontSize: '18px', flexShrink: 0 }}>
                              {c.name?.charAt(0)}
                            </div>
                            <div>
                              <p style={{ fontWeight: '700', color: '#1a1a2e', margin: '0', fontSize: '14px' }}>{c.name}</p>
                              <p style={{ color: '#f5a623', margin: '0', fontSize: '12px', fontFamily: 'monospace', fontWeight: '600' }}>{c.id}</p>
                            </div>
                          </div>
                          <span style={{ background: c.kWh < 50 ? '#fef2f2' : '#f0fdf4', color: c.kWh < 50 ? '#ef4444' : '#16a34a', padding: '3px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: '700' }}>
                            {c.kWh < 50 ? '⚠️ Critical' : '✓ Active'}
                          </span>
                        </div>

                        <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '12px', marginBottom: '14px' }}>
                          {[
                            { label: 'Email', value: c.email },
                            { label: 'Phone', value: c.phone },
                            { label: 'Address', value: c.address },
                            { label: 'kWh Balance', value: `${c.kWh} kWh`, bold: true },
                            { label: 'Joined', value: c.joinDate },
                            { label: 'Purchases', value: `${c.purchases?.length || 0} transactions` },
                          ].map((item, j) => (
                            <div key={j} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                              <span style={{ fontSize: '11px', color: '#9ca3af' }}>{item.label}</span>
                              <span style={{ fontSize: '12px', color: item.bold ? '#f5a623' : '#374151', fontWeight: item.bold ? '700' : '500', textAlign: 'right', maxWidth: '60%' }}>{item.value}</span>
                            </div>
                          ))}
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => handleEdit(c)} style={{ flex: 1, background: '#1a1a2e', color: 'white', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>✏️ Edit</button>
                          <button onClick={() => handleDelete(c.docId, c.name)} style={{ background: '#fef2f2', color: '#ef4444', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>🗑️</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PURCHASES TAB */}
            {activeTab === 'purchases' && (
              <div>
                <h2 style={{ fontWeight: '800', color: '#1a1a2e', marginBottom: '6px' }}>Purchase History</h2>
                <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>All electricity purchases across all accounts — updates live</p>
                <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  <div className="table-responsive">
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                          {['Customer', 'Customer ID', 'Date', 'Time', 'kWh Purchased', 'Amount Paid'].map(h => (
                            <th key={h} style={{ padding: '10px 12px', color: '#9ca3af', fontWeight: '600', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {customers.flatMap(c =>
                          (c.purchases || []).map((p, i) => ({
                            ...p, customerName: c.name, customerId: c.id
                          }))
                        ).sort((a, b) => new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date)).map((p, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                            <td style={{ padding: '12px', fontWeight: '600', color: '#1a1a2e' }}>{p.customerName}</td>
                            <td style={{ padding: '12px', color: '#f5a623', fontFamily: 'monospace', fontWeight: '600' }}>{p.customerId}</td>
                            <td style={{ padding: '12px', color: '#6b7280' }}>{p.date}</td>
                            <td style={{ padding: '12px', color: '#6b7280' }}>{p.time || '—'}</td>
                            <td style={{ padding: '12px', fontWeight: '700', color: '#3b82f6' }}>{p.kWh} kWh</td>
                            <td style={{ padding: '12px', fontWeight: '700', color: '#10b981' }}>₺{p.amount}</td>
                          </tr>
                        ))}
                        {customers.every(c => !c.purchases?.length) && (
                          <tr>
                            <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>No purchases recorded yet</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* EDIT CUSTOMER TAB */}
            {activeTab === 'edit' && editData && (
              <div className="row justify-content-center">
                <div className="col-lg-8">
                  <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div>
                        <h3 style={{ fontWeight: '700', color: '#1a1a2e', margin: '0 0 4px' }}>✏️ Edit Customer</h3>
                        <p style={{ color: '#9ca3af', fontSize: '13px', margin: '0' }}>Modifying: {editData.name} ({editData.id})</p>
                      </div>
                      <button onClick={() => setActiveTab('customers')} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#374151', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>← Back</button>
                    </div>

                    <div className="row g-3 mb-4">
                      {[
                        { label: 'Full Name', key: 'name', type: 'text' },
                        { label: 'Email Address', key: 'email', type: 'email' },
                        { label: 'Phone Number', key: 'phone', type: 'text' },
                        { label: 'Customer ID', key: 'id', type: 'text', disabled: true },
                        { label: 'kWh Balance', key: 'kWh', type: 'number' },
                        { label: 'Join Date', key: 'joinDate', type: 'date' },
                      ].map((field, i) => (
                        <div key={i} className="col-md-6">
                          <label style={{ fontWeight: '600', fontSize: '13px', color: '#374151', display: 'block', marginBottom: '6px' }}>{field.label}</label>
                          <input
                            type={field.type}
                            value={editData[field.key] || ''}
                            onChange={e => !field.disabled && setEditData({ ...editData, [field.key]: e.target.value })}
                            disabled={field.disabled}
                            style={{ width: '100%', padding: '11px 16px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '14px', background: field.disabled ? '#f8fafc' : 'white', color: field.disabled ? '#9ca3af' : '#1a1a2e', outline: 'none', boxSizing: 'border-box' }}
                          />
                        </div>
                      ))}
                      <div className="col-12">
                        <label style={{ fontWeight: '600', fontSize: '13px', color: '#374151', display: 'block', marginBottom: '6px' }}>Address</label>
                        <input type="text" value={editData.address || ''} onChange={e => setEditData({ ...editData, address: e.target.value })} style={{ width: '100%', padding: '11px 16px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                    </div>

                    {/* Quick kWh Actions */}
                    <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
                      <p style={{ fontWeight: '700', color: '#1a1a2e', fontSize: '14px', margin: '0 0 12px' }}>⚡ Quick kWh Adjustment</p>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {[50, 100, 200, 350, 500].map(amount => (
                          <button key={amount} onClick={() => setEditData({ ...editData, kWh: (parseFloat(editData.kWh) || 0) + amount })}
                            style={{ background: '#1a1a2e', color: '#f5a623', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '700' }}>
                            +{amount} kWh
                          </button>
                        ))}
                        <button onClick={() => setEditData({ ...editData, kWh: 0 })}
                          style={{ background: '#fef2f2', color: '#ef4444', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '700' }}>
                          Reset to 0
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button onClick={handleSaveEdit} style={{ flex: 1, background: 'linear-gradient(135deg, #f5a623, #f7c66b)', color: '#1a1a2e', border: 'none', padding: '14px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '15px' }}>
                        💾 Save Changes to Firebase
                      </button>
                      <button onClick={() => handleDelete(editData.docId, editData.name)} style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', padding: '14px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Toast */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: '#1a1a2e', color: 'white', padding: '14px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: '600', transform: toast ? 'translateY(0)' : 'translateY(100px)', opacity: toast ? 1 : 0, transition: 'all 0.3s ease', zIndex: 9999, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
        {toast}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div
          onClick={() => setShowLogoutConfirm(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: 'white', borderRadius: '16px', padding: '28px', maxWidth: '360px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', textAlign: 'center' }}
          >
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🚪</div>
            <h3 style={{ fontWeight: '800', color: '#1a1a2e', margin: '0 0 8px' }}>Log out?</h3>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 24px' }}>
              Are you sure you want to log out of the Admin Panel?
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                style={{ flex: 1, background: '#f8fafc', border: '1px solid #e2e8f0', color: '#374151', fontWeight: '700', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px' }}
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                style={{ flex: 1, background: '#ef4444', border: 'none', color: 'white', fontWeight: '700', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px' }}
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin