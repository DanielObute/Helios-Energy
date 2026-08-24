import React from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import BuyElectricity from './components/BuyElectricity'
import ApplianceTracker from './components/ApplianceTracker'
import Payment from './components/Payment'
import Profile from './components/Profile'
import Navbar from './components/Navbar'
import Admin from './components/Admin'

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)
  const [customer, setCustomer] = React.useState(null)
  const [isAdmin, setIsAdmin] = React.useState(false)

  return (
    <HashRouter>
      {isLoggedIn && !isAdmin && <Navbar setIsLoggedIn={setIsLoggedIn} customer={customer} />}
      <Routes>
        <Route path="/" element={
          isLoggedIn ? <Navigate to={isAdmin ? '/admin' : '/dashboard'} /> :
          <Login setIsLoggedIn={setIsLoggedIn} setCustomer={setCustomer} setIsAdmin={setIsAdmin} />
        } />
        <Route path="/dashboard" element={
          isLoggedIn && !isAdmin ? <Dashboard customer={customer} setCustomer={setCustomer} /> : <Navigate to="/" />
        } />
        <Route path="/buy-electricity" element={
          isLoggedIn && !isAdmin ? <BuyElectricity customer={customer} setCustomer={setCustomer} /> : <Navigate to="/" />
        } />
        <Route path="/appliance-tracker" element={
          isLoggedIn && !isAdmin ? <ApplianceTracker customer={customer} setCustomer={setCustomer} /> : <Navigate to="/" />
        } />
        <Route path="/payment" element={
          isLoggedIn && !isAdmin ? <Payment customer={customer} setCustomer={setCustomer} /> : <Navigate to="/" />
        } />
        <Route path="/profile" element={
          isLoggedIn && !isAdmin ? <Profile customer={customer} /> : <Navigate to="/" />
        } />
        <Route path="/admin" element={
          isLoggedIn && isAdmin ? <Admin setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} /> : <Navigate to="/" />
        } />
      </Routes>
    </HashRouter>
  )
}

export default App