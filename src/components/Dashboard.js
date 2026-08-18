import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Dashboard({ customer }) {
  const navigate = useNavigate()
  const [weather, setWeather] = useState(null)
  const [weatherLoading, setWeatherLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good Morning')
    else if (hour < 17) setGreeting('Good Afternoon')
    else setGreeting('Good Evening')

    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    axios.get('https://api.open-meteo.com/v1/forecast?latitude=35.1667&longitude=33.3667&current=temperature_2m,weathercode,windspeed_10m,relative_humidity_2m&timezone=Asia/Nicosia')
      .then(res => {
        setWeather(res.data.current)
        setWeatherLoading(false)
      })
      .catch(() => setWeatherLoading(false))
  }, [])

  const getWeatherDesc = (code) => {
    if (code === 0) return { label: 'Clear Sky', icon: '☀️' }
    if (code <= 3) return { label: 'Partly Cloudy', icon: '⛅' }
    if (code <= 48) return { label: 'Foggy', icon: '🌫️' }
    if (code <= 67) return { label: 'Rainy', icon: '🌧️' }
    if (code <= 77) return { label: 'Snowy', icon: '❄️' }
    if (code <= 82) return { label: 'Showers', icon: '🌦️' }
    return { label: 'Stormy', icon: '⛈️' }
  }

  const getUsageImpact = (temp) => {
    if (!temp) return { label: 'Normal Usage Expected', color: '#10b981', level: 'normal' }
    if (temp > 35) return { label: '🔴 Extreme Heat — Very High AC Usage Expected', color: '#ef4444', level: 'extreme' }
    if (temp > 28) return { label: '🟠 High Temperature — Increased AC Usage Expected', color: '#f59e0b', level: 'high' }
    if (temp > 20) return { label: '🟡 Moderate Temperature — Average Usage Expected', color: '#eab308', level: 'moderate' }
    return { label: '🟢 Cool Weather — Low Electricity Usage Expected', color: '#10b981', level: 'low' }
  }

  const kWhPercent = Math.min((customer?.kWh / 500) * 100, 100)
  const kWhStatus = customer?.kWh > 200 ? 'sufficient' : customer?.kWh > 50 ? 'low' : 'critical'

  const weatherData = weather ? getWeatherDesc(weather.weathercode) : null
  const usageImpact = getUsageImpact(weather?.temperature_2m)

  const bills = [
    { month: 'July 2026', units: 312, amount: 780, status: 'Paid', date: '2026-07-31' },
    { month: 'June 2026', units: 289, amount: 722, status: 'Paid', date: '2026-06-30' },
    { month: 'May 2026', units: 201, amount: 502, status: 'Paid', date: '2026-05-31' },
    { month: 'April 2026', units: 178, amount: 445, status: 'Paid', date: '2026-04-30' },
  ]

  return (
    <div style={{ background: '#f0f4f8', minHeight: '100vh' }}>

      {/* Weather Alert Strip */}
      {!weatherLoading && weather && (
        <div style={{ background: usageImpact.color, padding: '10px 0' }}>
          <div className="container-fluid px-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <span style={{ color: 'white', fontSize: '13px', fontWeight: '600' }}>
                {weatherData?.icon} Nicosia, North Cyprus — {weather.temperature_2m}°C {weatherData?.label} · Humidity: {weather.relative_humidity_2m}% · Wind: {weather.windspeed_10m} km/h
              </span>
              <span style={{ color: 'white', fontSize: '13px', fontWeight: '700', background: 'rgba(0,0,0,0.15)', padding: '3px 12px', borderRadius: '20px' }}>
                {usageImpact.label}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="container-fluid px-4 py-4">

        {/* Header Row */}
        <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
          <div>
            <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 2px 0' }}>{greeting}, {customer?.name?.split(' ')[0]}</p>
            <h1 style={{ fontWeight: '800', color: '#1a1a2e', fontSize: '26px', margin: '0 0 2px 0' }}>Account Overview</h1>
            <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0' }}>Customer ID: {customer?.id} · Last updated: {currentTime.toLocaleTimeString()}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0 0 2px 0' }}>{currentTime.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <span style={{ background: kWhStatus === 'sufficient' ? '#ecfdf5' : kWhStatus === 'low' ? '#fffbeb' : '#fef2f2', color: kWhStatus === 'sufficient' ? '#065f46' : kWhStatus === 'low' ? '#92400e' : '#991b1b', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}>
              {kWhStatus === 'sufficient' ? '● Account Active' : kWhStatus === 'low' ? '● Low Balance Warning' : '● Critical — Action Required'}
            </span>
          </div>
        </div>

        <div className="row g-4">

          {/* LEFT COLUMN */}
          <div className="col-lg-8">

            {/* Meter Display */}
            <div style={{ background: '#1a1a2e', borderRadius: '16px', padding: '32px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'rgba(245,166,35,0.06)', borderRadius: '50%' }}></div>
              <div style={{ position: 'absolute', bottom: '-60px', left: '40%', width: '150px', height: '150px', background: 'rgba(245,166,35,0.04)', borderRadius: '50%' }}></div>

              <div className="row align-items-center">
                <div className="col-md-6">
                  <p style={{ color: '#f5a623', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', margin: '0 0 8px 0', textTransform: 'uppercase' }}>⚡ Electricity Meter</p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                    <h2 style={{ color: 'white', fontWeight: '900', fontSize: '64px', margin: '0', fontFamily: 'monospace', letterSpacing: '-2px' }}>{customer?.kWh || 0}</h2>
                    <span style={{ color: '#f5a623', fontWeight: '700', fontSize: '20px' }}>kWh</span>
                  </div>
                  <p style={{ color: '#64748b', fontSize: '12px', margin: '0 0 16px 0' }}>Available Balance</p>

                  <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '99px', height: '8px', overflow: 'hidden', marginBottom: '8px' }}>
                    <div style={{ width: `${kWhPercent}%`, height: '100%', background: kWhStatus === 'sufficient' ? '#10b981' : kWhStatus === 'low' ? '#f59e0b' : '#ef4444', borderRadius: '99px', transition: 'width 1s ease' }}></div>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span style={{ color: '#64748b', fontSize: '11px' }}>0 kWh</span>
                    <span style={{ color: '#94a3b8', fontSize: '11px' }}>{kWhPercent.toFixed(1)}% of 500 kWh</span>
                    <span style={{ color: '#64748b', fontSize: '11px' }}>500 kWh</span>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="d-flex flex-column gap-3" style={{ paddingLeft: '24px', borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
                    {[
                      { label: 'Estimated Days Left', value: `~${Math.floor((customer?.kWh || 0) / 15)} days`, icon: '📅' },
                      { label: 'Daily Consumption', value: '~15 kWh/day', icon: '📊' },
                      { label: 'Meter Reading', value: `${4500 + (customer?.kWh || 0)} kWh`, icon: '🔢' },
                      { label: 'Tariff Rate', value: '₺2.50 / kWh', icon: '💰' },
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#64748b', fontSize: '12px' }}>{item.icon} {item.label}</span>
                        <span style={{ color: 'white', fontSize: '13px', fontWeight: '700' }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {kWhStatus === 'critical' && (
                <div style={{ marginTop: '20px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#fca5a5', fontSize: '13px', fontWeight: '600' }}>🔴 Critical balance — purchase electricity to avoid power interruption</span>
                  <button onClick={() => navigate('/buy-electricity')} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap' }}>Top Up Now</button>
                </div>
              )}
            </div>

            {/* Billing History Table */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h4 style={{ fontWeight: '700', color: '#1a1a2e', margin: '0 0 2px 0', fontSize: '16px' }}>📋 Billing History</h4>
                  <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0' }}>Your recent electricity bills</p>
                </div>
                <button onClick={() => navigate('/payment')} style={{ background: 'none', border: '1px solid #e2e8f0', color: '#374151', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>View All →</button>
              </div>
              <div className="table-responsive">
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                      {['Billing Period', 'Units Used', 'Amount', 'Status', 'Due Date'].map(h => (
                        <th key={h} style={{ padding: '10px 12px', color: '#9ca3af', fontWeight: '600', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bills.map((bill, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                        <td style={{ padding: '14px 12px', fontWeight: '600', color: '#1a1a2e' }}>{bill.month}</td>
                        <td style={{ padding: '14px 12px', color: '#374151' }}>{bill.units} kWh</td>
                        <td style={{ padding: '14px 12px', fontWeight: '700', color: '#1a1a2e' }}>₺{bill.amount}</td>
                        <td style={{ padding: '14px 12px' }}>
                          <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>✓ {bill.status}</span>
                        </td>
                        <td style={{ padding: '14px 12px', color: '#6b7280', fontSize: '12px' }}>{bill.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="col-lg-4">

            {/* Account Card */}
            <div style={{ background: 'linear-gradient(135deg, #f5a623, #f7c66b)', borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
              <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '1px', color: '#7c4a00', margin: '0 0 12px 0', textTransform: 'uppercase' }}>Account Details</p>
              <div className="d-flex align-items-center gap-12 mb-3" style={{ gap: '12px' }}>
                <div style={{ width: '48px', height: '48px', background: '#1a1a2e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: '#f5a623', fontSize: '20px', flexShrink: 0 }}>
                  {customer?.name?.charAt(0)}
                </div>
                <div>
                  <p style={{ fontWeight: '800', color: '#1a1a2e', margin: '0', fontSize: '16px' }}>{customer?.name}</p>
                  <p style={{ color: '#7c4a00', margin: '0', fontSize: '12px' }}>{customer?.id}</p>
                </div>
              </div>
              {[
                { label: 'Email', value: customer?.email },
                { label: 'Phone', value: customer?.phone },
                { label: 'Address', value: customer?.address },
              ].map((item, i) => (
                <div key={i} style={{ marginBottom: '8px' }}>
                  <p style={{ fontSize: '10px', color: '#7c4a00', margin: '0', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</p>
                  <p style={{ fontSize: '12px', color: '#1a1a2e', margin: '0', fontWeight: '600' }}>{item.value}</p>
                </div>
              ))}
            </div>

            {/* Weather Widget */}
            {!weatherLoading && weather && (
              <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
                <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '1px', color: '#9ca3af', margin: '0 0 16px 0', textTransform: 'uppercase' }}>☁️ Live Weather — Nicosia</p>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <span style={{ fontSize: '48px' }}>{weatherData?.icon}</span>
                  <div>
                    <h2 style={{ fontWeight: '900', color: '#1a1a2e', fontSize: '36px', margin: '0' }}>{weather.temperature_2m}°C</h2>
                    <p style={{ color: '#6b7280', fontSize: '13px', margin: '0' }}>{weatherData?.label}</p>
                  </div>
                </div>
                <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '12px' }}>
                  <p style={{ fontSize: '12px', color: '#374151', margin: '0', fontWeight: '600' }}>💡 Usage Prediction</p>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>{usageImpact.label}</p>
                </div>
              </div>
            )}

            {/* Quick Top Up */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
              <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '1px', color: '#9ca3af', margin: '0 0 16px 0', textTransform: 'uppercase' }}>⚡ Quick Top Up</p>
              <div className="d-flex flex-column gap-2">
                {[50, 100, 200, 350].map(kWh => (
                  <button key={kWh} onClick={() => navigate('/buy-electricity')} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fffbeb'}
                    onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}>
                    <span style={{ fontWeight: '600', color: '#1a1a2e', fontSize: '14px' }}>{kWh} kWh</span>
                    <span style={{ fontWeight: '700', color: '#f5a623', fontSize: '14px' }}>₺{kWh * 2.5}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard