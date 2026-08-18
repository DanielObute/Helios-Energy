
import React, { useState } from 'react'

const transactionHistory = [
  { id: 'TXN-001', date: '2026-08-01', package: 'Standard', kWh: 200, amount: 460, status: 'Success' },
  { id: 'TXN-002', date: '2026-07-05', package: 'Basic', kWh: 100, amount: 240, status: 'Success' },
  { id: 'TXN-003', date: '2026-06-12', package: 'Premium', kWh: 350, amount: 780, status: 'Success' },
  { id: 'TXN-004', date: '2026-05-20', package: 'Starter', kWh: 50, amount: 125, status: 'Success' },
  { id: 'TXN-005', date: '2026-04-14', package: 'Ultimate', kWh: 500, amount: 1050, status: 'Success' },
]

function Payment({ customer }) {
  const [activeTab, setActiveTab] = useState('history')

  const totalSpent = transactionHistory.reduce((sum, t) => sum + t.amount, 0)
  const totalKwh = transactionHistory.reduce((sum, t) => sum + t.kWh, 0)

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '32px 0' }}>
      <div className="container">

        <div className="mb-4">
          <h1 style={{ fontWeight: '800', color: '#1a1a2e', fontSize: '28px', margin: '0 0 4px 0' }}>💳 Payment</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: '0' }}>Your payment history and saved card details</p>
        </div>

        <div className="row g-3 mb-4">
          {[
            { label: 'Total Spent', value: `₺${totalSpent.toLocaleString()}`, icon: '💰', color: '#f5a623' },
            { label: 'Total kWh Purchased', value: `${totalKwh} kWh`, icon: '⚡', color: '#3b82f6' },
            { label: 'Transactions', value: transactionHistory.length, icon: '🧾', color: '#8b5cf6' },
            { label: 'Current Balance', value: `${customer?.kWh} kWh`, icon: '📊', color: '#10b981' },
          ].map((item, i) => (
            <div key={i} className="col-md-3 col-6">
              <div style={{ background: 'white', borderRadius: '16px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '28px', marginBottom: '6px' }}>{item.icon}</div>
                <h3 style={{ fontWeight: '800', color: item.color, fontSize: '20px', margin: '0 0 4px 0' }}>{item.value}</h3>
                <p style={{ color: '#6b7280', fontSize: '12px', margin: '0' }}>{item.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <div style={{ borderBottom: '1px solid #f1f5f9', display: 'flex' }}>
            {['history', 'card'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{ padding: '16px 28px', border: 'none', background: 'none', fontWeight: '700', fontSize: '14px', color: activeTab === tab ? '#1a1a2e' : '#9ca3af', borderBottom: activeTab === tab ? '2px solid #f5a623' : '2px solid transparent', cursor: 'pointer' }}
              >
                {tab === 'history' ? '🧾 Transaction History' : '💳 Saved Card'}
              </button>
            ))}
          </div>

          <div style={{ padding: '28px' }}>
            {activeTab === 'history' && (
              <div>
                <div className="table-responsive">
                  <table className="table" style={{ fontSize: '14px' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc' }}>
                        {['Transaction ID', 'Date', 'Package', 'kWh', 'Amount', 'Status'].map(h => (
                          <th key={h} style={{ padding: '12px 16px', color: '#6b7280', fontWeight: '600', border: 'none', fontSize: '13px' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {transactionHistory.map((txn, i) => (
                        <tr key={txn.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                          <td style={{ padding: '14px 16px', fontWeight: '700', color: '#1a1a2e', border: 'none' }}>{txn.id}</td>
                          <td style={{ padding: '14px 16px', color: '#6b7280', border: 'none' }}>{txn.date}</td>
                          <td style={{ padding: '14px 16px', color: '#374151', border: 'none', fontWeight: '600' }}>{txn.package}</td>
                          <td style={{ padding: '14px 16px', color: '#3b82f6', border: 'none', fontWeight: '700' }}>{txn.kWh} kWh</td>
                          <td style={{ padding: '14px 16px', color: '#f5a623', border: 'none', fontWeight: '800', fontSize: '15px' }}>₺{txn.amount}</td>
                          <td style={{ padding: '14px 16px', border: 'none' }}>
                            <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>✅ {txn.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'card' && (
              <div className="row justify-content-center">
                <div className="col-md-6">
                  <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', borderRadius: '20px', padding: '32px', color: 'white', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', background: 'rgba(245,166,35,0.15)', borderRadius: '50%' }}></div>
                    <div style={{ position: 'absolute', bottom: '-30px', right: '60px', width: '80px', height: '80px', background: 'rgba(245,166,35,0.1)', borderRadius: '50%' }}></div>
                    <div style={{ fontSize: '28px', marginBottom: '24px' }}>☀️</div>
                    <p style={{ opacity: '0.6', fontSize: '12px', margin: '0 0 8px 0', letterSpacing: '2px' }}>CARD NUMBER</p>
                    <h2 style={{ fontWeight: '700', fontSize: '22px', letterSpacing: '3px', margin: '0 0 24px 0' }}>{customer?.cardNumber || '**** **** **** ****'}</h2>
                    <div className="d-flex justify-content-between align-items-end">
                      <div>
                        <p style={{ opacity: '0.6', fontSize: '11px', margin: '0 0 4px 0', letterSpacing: '1px' }}>CARDHOLDER</p>
                        <p style={{ fontWeight: '700', fontSize: '15px', margin: '0' }}>{customer?.name}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ opacity: '0.6', fontSize: '11px', margin: '0 0 4px 0' }}>EXPIRES</p>
                        <p style={{ fontWeight: '700', margin: '0' }}>12/28</p>
                      </div>
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '20px' }}>
                    <p style={{ fontWeight: '700', color: '#1a1a2e', fontSize: '14px', margin: '0 0 12px 0' }}>🔒 Card Security</p>
                    <p style={{ color: '#6b7280', fontSize: '13px', margin: '0' }}>Your card details are encrypted and stored securely. We never store your full CVV or card number.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Payment;
