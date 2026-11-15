import { useState } from 'react'
import './App.css'
import Auth from './Auth.jsx'
import Dashboard from './Dashboard.jsx'

export default function App() {
  const [usuario, setUsuario] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('huellitas_sesion')) }
    catch { return null }
  })

  const entrar = (u) => {
    sessionStorage.setItem('huellitas_sesion', JSON.stringify(u))
    setUsuario(u)
  }
  const salir = () => {
    sessionStorage.removeItem('huellitas_sesion')
    setUsuario(null)
  }

  return usuario
    ? <Dashboard usuario={usuario} onSalir={salir} />
    : <Auth onEntrar={entrar} />
}
