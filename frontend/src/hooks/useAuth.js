import { useEffect, useState } from 'react'

export default function useAuth(){
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(()=>{
    const onStorage = () => setToken(localStorage.getItem('token'))
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const login = (t) => { localStorage.setItem('token', t); setToken(t) }
  const logout = () => { localStorage.removeItem('token'); setToken(null) }

  return { token, login, logout }
}
