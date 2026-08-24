
import React, { useState } from 'react'
import { db } from '../Firebase'
import { doc, updateDoc } from 'firebase/firestore'

function ApplianceTracker({ customer, setCustomer }) {
  const [appliances, setAppliances] = useState(customer?.appliances || [])
  const [newAppliance, setNewAppliance] = useState({ name: '', watts: '', hoursPerDay: '', icon: '🔌', category: 'Other' })
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  const getDailyKwh = (watts, hours) => ((watts * hours) / 1000).toFixed(2)
  const getMonthlyKwh = (watts, hours) => ((watts * hours * 30) / 1000).toFixed(1)
  const getMonthlyCost = (watts, hours) => ((watts * hours * 30 / 1000) * 2.5).toFixed(2)

  const totalDailyKwh = appliances.reduce((sum, a) => sum + parseFloat(getDailyKwh(a.watts, a.hoursPerDay)), 0).toFixed(2)
  const totalMonthlyKwh = appliances.reduce((sum, a) => sum + parseFloat(getMonthlyKwh(a.watts, a.hoursPerDay)), 0).toFixed(1)
  const totalMonthlyCost = appliances.reduce((sum, a) => sum + parseFloat(getMonthlyCost(a.watts, a.hoursPerDay)), 0).toFixed(2)

  const sorted = [...appliances].sort((a, b) => parseFloat(getDailyKwh(b.watts, b.hoursPerDay)) - parseFloat(getDailyKwh(a.watts, a.hoursPerDay)))
  const maxKwh = sorted.length ? parseFloat(getDailyKwh(sorted[0].watts, sorted[0].hoursPerDay)) : 0

  const persist = async (updatedList) => {
    setSaving(true)
    try {
      const customerRef = doc(db, 'customers', customer.docId)
      await updateDoc(customerRef, { appliances: updatedList })
      setCustomer({ ...customer, appliances: updatedList })
    } catch (err) {
      console.error('Failed to save appliances:', err)
    }
    setSaving(false)
  }

  const addAppliance = (e) => {
    e.preventDefault()
    const newOne = { ...newAppliance, id: Date.now(), watts: parseInt(newAppliance.watts), hoursPerDay: parseFloat(newAppliance.hoursPerDay) }
    const updated = [...appliances, newOne]
    setAppliances(updated)
    persist(updated)
    setNewAppliance({ name: '', watts: '', hoursPerDay: '', icon: '🔌', category: 'Other' })
    setShowForm(false)
  }

  const removeAppliance = (id) => {
    const updated = appliances.filter(a => a.id !== id)
    setAppliances(updated)
    persist(updated)
  }

  const updateHours = (id, hours) => {
    const updated = appliances.map(a => a.id === id ? { ...a, hoursPerDay: parseFloat(hours) || 0 } : a)
    setAppliances(updated)
    persist(updated)
  }

  const getBarColor = (kwh) => {
    const pct = maxKwh ? (kwh / maxKwh) * 100 : 0
    if (pct > 70) return '#ef4444'
    if (pct > 40) return '#f59e0b'
    return '#10b981'
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '32px 0' }}>
      <div className="container">

        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
          <div>
            <h1 style={{ fontWeight: '800', color: '#1a1a2e', fontSize: '28px', margin: '0 0 4px 0' }}>🏠 Appliance Tracker</h1>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: '0' }}>
              {saving ? 'Saving...' : 'Track which appliances consume the most electricity'}
            </p>
          </div>
          <button onClick={() => setShowForm(!showForm)} style={{ background: 'linear-gradient(135deg, #f5a623, #f7c66b)', color: '#1a1a2e', fontWeight: '700', padding: '12px 24px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '14px' }}>
            {showForm ? '✕ Cancel' : '+ Add Appliance'}
          </button>
        </div>

        <div className="row g-3 mb-4">
          {[
            { label: 'Daily Usage', value: `${totalDailyKwh} kWh`, icon: '📅', color: '#3b82f6' },
            { label: 'Monthly Usage', value: `${totalMonthlyKwh} kWh`, icon: '📊', color: '#8b5cf6' },
            { label: 'Monthly Cost', value: `₺${totalMonthlyCost}`, icon: '💰', color: '#f5a623' },
            { label: 'Appliances', value: appliances.length, icon: '🔌', color: '#10b981' },
          ].map((item, i) => (
            <div key={i} className="col-md-3 col-6">
              <div style={{ background: 'white', borderRadius: '16px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '28px', marginBottom: '6px' }}>{item.icon}</div>
                <h3 style={{ fontWeight: '800', color: item.color, fontSize: '22px', margin: '0 0 4px 0' }}>{item.value}</h3>
                <p style={{ color: '#6b7280', fontSize: '12px', margin: '0' }}>{item.label}</p>
              </div>
            </div>
          ))}
        </div>

        {showForm && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <h5 style={{ fontWeight: '700', color: '#1a1a2e', marginBottom: '16px' }}>➕ Add New Appliance</h5>
            <form onSubmit={addAppliance}>
              <div className="row g-3">
                <div className="col-md-3">
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Appliance Name</label>
                  <input type="text" className="form-control" placeholder="e.g. Iron" value={newAppliance.name} onChange={e => setNewAppliance({ ...newAppliance, name: e.target.value })} required style={{ padding: '10px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '14px' }} />
                </div>
                <div className="col-md-2">
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Watts (W)</label>
                  <input type="number" className="form-control" placeholder="e.g. 1000" value={newAppliance.watts} onChange={e => setNewAppliance({ ...newAppliance, watts: e.target.value })} required style={{ padding: '10px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '14px' }} />
                </div>
                <div className="col-md-2">
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Hours/Day</label>
                  <input type="number" className="form-control" placeholder="e.g. 2" step="0.5" value={newAppliance.hoursPerDay} onChange={e => setNewAppliance({ ...newAppliance, hoursPerDay: e.target.value })} required style={{ padding: '10px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '14px' }} />
                </div>
                <div className="col-md-2">
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Icon</label>
                  <input type="text" className="form-control" value={newAppliance.icon} onChange={e => setNewAppliance({ ...newAppliance, icon: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '14px' }} />
                </div>
                <div className="col-md-3 d-flex align-items-end">
                  <button type="submit" style={{ width: '100%', background: '#1a1a2e', color: 'white', fontWeight: '700', padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px' }}>Add Appliance</button>
                </div>
              </div>
            </form>
          </div>
        )}

        {appliances.length === 0 ? (
          <div style={{ background: 'white', borderRadius: '16px', padding: '60px 20px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔌</div>
            <p style={{ fontWeight: '700', color: '#1a1a2e', fontSize: '16px', margin: '0 0 4px' }}>No appliances added yet</p>
            <p style={{ color: '#9ca3af', fontSize: '13px', margin: '0 0 20px' }}>Add your appliances to start tracking your electricity usage</p>
            <button onClick={() => setShowForm(true)} style={{ background: 'linear-gradient(135deg, #f5a623, #f7c66b)', color: '#1a1a2e', fontWeight: '700', padding: '12px 28px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '14px' }}>
              + Add Your First Appliance
            </button>
          </div>
        ) : (
          <>
            <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', marginBottom: '24px' }}>
              <h4 style={{ fontWeight: '700', color: '#1a1a2e', marginBottom: '20px' }}>📊 Energy Consumption Chart (Daily kWh)</h4>
              <div className="d-flex flex-column gap-3">
                {sorted.map(appliance => {
                  const kwh = parseFloat(getDailyKwh(appliance.watts, appliance.hoursPerDay))
                  const pct = maxKwh ? (kwh / maxKwh) * 100 : 0
                  return (
                    <div key={appliance.id}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>{appliance.icon} {appliance.name}</span>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: getBarColor(kwh) }}>{kwh} kWh/day</span>
                      </div>
                      <div style={{ background: '#f1f5f9', borderRadius: '99px', height: '10px', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: getBarColor(kwh), borderRadius: '99px', transition: 'width 0.6s ease' }}></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
              <h4 style={{ fontWeight: '700', color: '#1a1a2e', marginBottom: '20px' }}>🔌 All Appliances</h4>
              <div className="table-responsive">
                <table className="table" style={{ fontSize: '14px' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      <th style={{ padding: '12px', color: '#6b7280', fontWeight: '600', border: 'none' }}>Appliance</th>
                      <th style={{ padding: '12px', color: '#6b7280', fontWeight: '600', border: 'none' }}>Watts</th>
                      <th style={{ padding: '12px', color: '#6b7280', fontWeight: '600', border: 'none' }}>Hours/Day</th>
                      <th style={{ padding: '12px', color: '#6b7280', fontWeight: '600', border: 'none' }}>Daily kWh</th>
                      <th style={{ padding: '12px', color: '#6b7280', fontWeight: '600', border: 'none' }}>Monthly kWh</th>
                      <th style={{ padding: '12px', color: '#6b7280', fontWeight: '600', border: 'none' }}>Monthly Cost</th>
                      <th style={{ padding: '12px', color: '#6b7280', fontWeight: '600', border: 'none' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appliances.map(a => (
                      <tr key={a.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px', fontWeight: '600', color: '#1a1a2e', border: 'none' }}>{a.icon} {a.name}</td>
                        <td style={{ padding: '12px', color: '#374151', border: 'none' }}>{a.watts}W</td>
                        <td style={{ padding: '12px', border: 'none' }}>
                          <input
                            type="number"
                            value={a.hoursPerDay}
                            step="0.5"
                            min="0"
                            max="24"
                            onChange={(e) => updateHours(a.id, e.target.value)}
                            style={{ width: '70px', padding: '4px 8px', borderRadius: '6px', border: '1.5px solid #e2e8f0', fontSize: '13px' }}
                          />
                        </td>
                        <td style={{ padding: '12px', fontWeight: '700', color: getBarColor(parseFloat(getDailyKwh(a.watts, a.hoursPerDay))), border: 'none' }}>{getDailyKwh(a.watts, a.hoursPerDay)}</td>
                        <td style={{ padding: '12px', color: '#374151', border: 'none' }}>{getMonthlyKwh(a.watts, a.hoursPerDay)}</td>
                        <td style={{ padding: '12px', fontWeight: '700', color: '#1a1a2e', border: 'none' }}>₺{getMonthlyCost(a.watts, a.hoursPerDay)}</td>
                        <td style={{ padding: '12px', border: 'none' }}>
                          <button onClick={() => removeAppliance(a.id)} style={{ background: '#fef2f2', color: '#ef4444', border: 'none', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ApplianceTracker