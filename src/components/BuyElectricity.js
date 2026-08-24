
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const packages = [
  { id: 1, kWh: 50, price: 125, label: 'Starter', icon: '🌱', description: 'Perfect for short term' },
  { id: 2, kWh: 100, price: 240, label: 'Basic', icon: '⚡', description: 'Great for 1-2 weeks', popular: false },
  { id: 3, kWh: 200, price: 460, label: 'Standard', icon: '🌟', description: 'Most popular choice', popular: true },
  { id: 4, kWh: 350, price: 780, label: 'Premium', icon: '🏆', description: 'Best value for money' },
  { id: 5, kWh: 500, price: 1050, label: 'Ultimate', icon: '👑', description: 'Full month coverage' },
]

function BuyElectricity({ customer, setCustomer }) {
  const [selected, setSelected] = useState(null)
  const [step, setStep] = useState(1)
  const [paymentInfo, setPaymentInfo] = useState({ cardNumber: '', expiry: '', cvv: '', name: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target
  
    if (name === 'expiry') {
      // Strip everything except digits
      let digits = value.replace(/\D/g, '')
      // Limit to 4 digits (MMYY)
      digits = digits.slice(0, 4)
      // Insert the slash after the first 2 digits
      let formatted = digits
      if (digits.length > 2) {
        formatted = digits.slice(0, 2) + '/' + digits.slice(2)
      }
      setPaymentInfo({ ...paymentInfo, expiry: formatted })
      return
    }
  
    setPaymentInfo({ ...paymentInfo, [name]: value })
  }

  const handlePurchase = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { db } = await import('../Firebase')
      const { doc, updateDoc, arrayUnion } = await import('firebase/firestore')
  
      const now = new Date()
      const newPurchase = {
        date: now.toISOString().split('T')[0],
        time: now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        timestamp: now.toISOString(), // full timestamp, useful for sorting
        kWh: selected.kWh,
        amount: selected.price,
        package: selected.label
      }
  
      const customerRef = doc(db, 'customers', customer.docId)
      await updateDoc(customerRef, {
        kWh: (customer.kWh || 0) + selected.kWh,
        purchases: arrayUnion(newPurchase)
      })
  
      setCustomer({ ...customer, kWh: customer.kWh + selected.kWh, purchases: [...(customer.purchases || []), newPurchase] })
      setLoading(false)
      setSuccess(true)
    } catch (err) {
      console.error('Purchase failed:', err)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '48px', textAlign: 'center', maxWidth: '440px', width: '100%', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
          <h2 style={{ fontWeight: '800', color: '#1a1a2e', marginBottom: '8px' }}>Payment Successful!</h2>
          <p style={{ color: '#6b7280', marginBottom: '8px' }}>You have successfully purchased <strong>{selected?.kWh} kWh</strong></p>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>Your new balance is <strong style={{ color: '#10b981' }}>{customer?.kWh} kWh</strong></p>
          <div style={{ background: '#f0fdf4', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
            <p style={{ margin: '0', color: '#065f46', fontSize: '14px', fontWeight: '600' }}>🧾 Receipt</p>
            <p style={{ margin: '4px 0 0', color: '#065f46', fontSize: '13px' }}>Package: {selected?.label} — {selected?.kWh} kWh</p>
            <p style={{ margin: '2px 0 0', color: '#065f46', fontSize: '13px' }}>Amount Paid: ₺{selected?.price}</p>
            <p style={{ margin: '2px 0 0', color: '#065f46', fontSize: '13px' }}>Customer: {customer?.name}</p>
          </div>
          <button onClick={() => navigate('/dashboard')} style={{ background: 'linear-gradient(135deg, #f5a623, #f7c66b)', color: '#1a1a2e', fontWeight: '700', padding: '14px 32px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '15px', width: '100%' }}>
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '32px 0' }}>
      <div className="container">

        <div className="text-center mb-4">
          <h1 style={{ fontWeight: '800', color: '#1a1a2e', fontSize: '28px' }}>⚡ Buy Electricity</h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Current Balance: <strong style={{ color: '#f5a623' }}>{customer?.kWh} kWh</strong></p>
        </div>

        <div className="d-flex justify-content-center gap-3 mb-4">
          {['Select Package', 'Payment', 'Confirm'].map((s, i) => (
            <div key={i} className="d-flex align-items-center gap-2">
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: step > i ? '#f5a623' : step === i + 1 ? '#1a1a2e' : '#e2e8f0', color: step > i ? '#1a1a2e' : step === i + 1 ? 'white' : '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '13px' }}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: '13px', color: step === i + 1 ? '#1a1a2e' : '#9ca3af', fontWeight: step === i + 1 ? '700' : '400' }}>{s}</span>
              {i < 2 && <span style={{ color: '#e2e8f0', marginLeft: '4px' }}>—</span>}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div>
            <div className="row g-3 mb-4">
              {packages.map(pkg => (
                <div key={pkg.id} className="col-md-4 col-sm-6">
                  <div
                    onClick={() => setSelected(pkg)}
                    style={{ background: 'white', borderRadius: '16px', padding: '24px', cursor: 'pointer', border: selected?.id === pkg.id ? '2px solid #f5a623' : '2px solid transparent', boxShadow: selected?.id === pkg.id ? '0 8px 24px rgba(245,166,35,0.2)' : '0 2px 10px rgba(0,0,0,0.06)', transition: 'all 0.2s', position: 'relative' }}
                  >
                    {pkg.popular && (
                      <span style={{ position: 'absolute', top: '-10px', right: '16px', background: '#f5a623', color: '#1a1a2e', fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px' }}>POPULAR</span>
                    )}
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>{pkg.icon}</div>
                    <h4 style={{ fontWeight: '700', color: '#1a1a2e', margin: '0 0 4px 0' }}>{pkg.label}</h4>
                    <p style={{ color: '#6b7280', fontSize: '12px', margin: '0 0 12px 0' }}>{pkg.description}</p>
                    <h3 style={{ fontWeight: '800', color: '#f5a623', fontSize: '28px', margin: '0 0 2px 0' }}>{pkg.kWh} <span style={{ fontSize: '14px', color: '#6b7280' }}>kWh</span></h3>
                    <p style={{ fontWeight: '700', color: '#1a1a2e', margin: '0', fontSize: '18px' }}>₺{pkg.price}</p>
                    <p style={{ color: '#9ca3af', fontSize: '11px', margin: '4px 0 0 0' }}>₺{(pkg.price / pkg.kWh).toFixed(2)} per kWh</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center">
              <button
                disabled={!selected}
                onClick={() => setStep(2)}
                style={{ background: selected ? 'linear-gradient(135deg, #f5a623, #f7c66b)' : '#e2e8f0', color: selected ? '#1a1a2e' : '#9ca3af', fontWeight: '700', padding: '14px 48px', borderRadius: '12px', border: 'none', cursor: selected ? 'pointer' : 'not-allowed', fontSize: '15px' }}
              >
                Continue to Payment →
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', borderRadius: '12px', padding: '20px', marginBottom: '24px', color: 'white' }}>
                  <p style={{ margin: '0 0 4px 0', fontSize: '12px', opacity: '0.7' }}>Selected Package</p>
                  <h3 style={{ margin: '0 0 4px 0', fontWeight: '800' }}>{selected?.label} — {selected?.kWh} kWh</h3>
                  <h2 style={{ margin: '0', color: '#f5a623', fontWeight: '800', fontSize: '28px' }}>₺{selected?.price}</h2>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); setStep(3) }}>
                  <h5 style={{ fontWeight: '700', color: '#1a1a2e', marginBottom: '16px' }}>💳 Card Details</h5>
                  <div className="mb-3">
                    <label style={{ fontWeight: '600', fontSize: '13px', color: '#374151', display: 'block', marginBottom: '6px' }}>Cardholder Name</label>
                    <input type="text" name="name" className="form-control" placeholder="John Doe" value={paymentInfo.name} onChange={handleInputChange} required style={{ padding: '12px', borderRadius: '10px', border: '1.5px solid #e2e8f0' }} />
                  </div>
                  <div className="mb-3">
                    <label style={{ fontWeight: '600', fontSize: '13px', color: '#374151', display: 'block', marginBottom: '6px' }}>Card Number</label>
                    <input type="text" name="cardNumber" className="form-control" placeholder="1234 5678 9012 3456" maxLength="19" value={paymentInfo.cardNumber} onChange={handleInputChange} required style={{ padding: '12px', borderRadius: '10px', border: '1.5px solid #e2e8f0' }} />
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label style={{ fontWeight: '600', fontSize: '13px', color: '#374151', display: 'block', marginBottom: '6px' }}>Expiry Date</label>
                      <input type="text" name="expiry" className="form-control" placeholder="MM/YY" maxLength="5" value={paymentInfo.expiry} onChange={handleInputChange} required style={{ padding: '12px', borderRadius: '10px', border: '1.5px solid #e2e8f0' }} />
                    </div>
                    <div className="col-6">
                      <label style={{ fontWeight: '600', fontSize: '13px', color: '#374151', display: 'block', marginBottom: '6px' }}>CVV</label>
                      <input type="password" name="cvv" className="form-control" placeholder="***" maxLength="3" value={paymentInfo.cvv} onChange={handleInputChange} required style={{ padding: '12px', borderRadius: '10px', border: '1.5px solid #e2e8f0' }} />
                    </div>
                  </div>
                  <div className="d-flex gap-3">
                    <button type="button" onClick={() => setStep(1)} style={{ flex: '1', background: '#f8fafc', color: '#374151', fontWeight: '700', padding: '13px', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>← Back</button>
                    <button type="submit" style={{ flex: '2', background: 'linear-gradient(135deg, #f5a623, #f7c66b)', color: '#1a1a2e', fontWeight: '700', padding: '13px', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>Review Order →</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                <h4 style={{ fontWeight: '700', color: '#1a1a2e', marginBottom: '20px' }}>🧾 Order Summary</h4>
                {[
                  { label: 'Customer', value: customer?.name },
                  { label: 'Customer ID', value: customer?.id },
                  { label: 'Package', value: `${selected?.label} (${selected?.kWh} kWh)` },
                  { label: 'Card', value: `**** **** **** ${paymentInfo.cardNumber.slice(-4)}` },
                  { label: 'Total Amount', value: `₺${selected?.price}`, highlight: true },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < 4 ? '1px solid #f1f5f9' : 'none' }}>
                    <span style={{ color: '#6b7280', fontSize: '14px' }}>{item.label}</span>
                    <span style={{ fontWeight: '700', color: item.highlight ? '#f5a623' : '#1a1a2e', fontSize: item.highlight ? '18px' : '14px' }}>{item.value}</span>
                  </div>
                ))}
                <form onSubmit={handlePurchase} style={{ marginTop: '24px' }}>
                  <div className="d-flex gap-3">
                    <button type="button" onClick={() => setStep(2)} style={{ flex: '1', background: '#f8fafc', color: '#374151', fontWeight: '700', padding: '13px', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>← Back</button>
                    <button type="submit" disabled={loading} style={{ flex: '2', background: loading ? '#9ca3af' : 'linear-gradient(135deg, #10b981, #059669)', color: 'white', fontWeight: '700', padding: '13px', borderRadius: '10px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}>
                      {loading ? '⏳ Processing...' : '✅ Confirm & Pay'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BuyElectricity;