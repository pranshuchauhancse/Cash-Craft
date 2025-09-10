import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth.js'

export default function Navbar(){
  const { token, logout } = useAuth()
  const nav = useNavigate()

  return (
    <nav className="navbar">
      <div className="nav-left"><Link to="/">CashCraft 💸</Link></div>
      <div className="nav-right">
        {!token ? (
          <>
            <Link className="btn" to="/login">Login</Link>
            <Link className="btn primary" to="/register">Register</Link>
          </>
        ) : (
          <>
            <Link className="btn" to="/dashboard">Dashboard</Link>
            <Link className="btn" to="/expenses">Expenses</Link>
            <Link className="btn" to="/setting">Settings</Link>
            <button className="btn danger" onClick={()=>{logout(); nav('/')}}>Logout</button>
          </>
        )}
      </div>
    </nav>
  )
}
