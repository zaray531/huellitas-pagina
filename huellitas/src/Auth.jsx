import { useState } from 'react'
import { PawPrint } from 'lucide-react'
import { Foto } from './Foto.jsx'
import { inicial } from './data.js'

export default function Auth({ onEntrar }) {
  const [modo, setModo] = useState('registro')
  const [error, setError] = useState('')
  const registro = modo === 'registro'

  const usuariosGuardados = () => {
    try { return JSON.parse(localStorage.getItem('huellitas_usuarios')) || [] }
    catch { return [] }
  }

  const enviar = (e) => {
    e.preventDefault()
    const d = Object.fromEntries(new FormData(e.target))
    const correo = d.correo.trim().toLowerCase()
    const usuarios = usuariosGuardados()

    if (registro) {
      if (d.clave.length < 8) return setError('La contraseña debe tener mínimo 8 caracteres.')
      if (d.clave !== d.confirmarClave) return setError('Las contraseñas no coinciden.')
      if (usuarios.some((u) => u.correo === correo)) return setError('Ese correo ya está registrado. Inicia sesión.')

      const nuevo = { nombre: d.nombre.trim(), correo, clave: d.clave, rol: d.rol }
      localStorage.setItem('huellitas_usuarios', JSON.stringify([...usuarios, nuevo]))
      setError('')
      return onEntrar({ nombre: nuevo.nombre, rol: nuevo.rol })
    }

    const usuario = usuarios.find((u) => u.correo === correo)
    if (!usuario) return setError('No existe una cuenta con ese correo. Crea tu cuenta primero.')
    if (usuario.clave !== d.clave) return setError('Contraseña incorrecta. Inténtalo de nuevo.')

    setError('')
    onEntrar({ nombre: usuario.nombre, rol: usuario.rol })
  }

  return (
    <div className="auth">
      <div className="auth-card">
        <aside className="auth-lado">
          <Foto mascota={inicial[0]} className="auth-foto" />
          <div className="auth-velo" />
          <div className="auth-texto">
            <span className="logo"><PawPrint /> Huellitas</span>
            <h2>{registro ? 'Únete al equipo' : 'Qué bueno verte de nuevo'}</h2>
            <p>Ayuda a que más mascotas encuentren una familia.</p>
          </div>
        </aside>
        <form className="auth-form" onSubmit={enviar}>
          <h1>{registro ? 'Crear cuenta' : 'Iniciar sesión'}</h1>
          <p className="suave">{registro ? 'Solo te tomará un minuto' : 'Ingresa con tu correo y contraseña'}</p>
          {registro && <label>Nombre completo<input name="nombre" required placeholder="Angely Arboleda" /></label>}
          <label>Correo electrónico<input name="correo" type="email" required placeholder="angeliarboleda74@gmail.com" /></label>
          {registro && (
            <label>Rol en el sistema
              <select name="rol" required defaultValue="">
                <option value="" disabled>Selecciona tu rol</option>
                <option>Veterinario</option><option>Voluntario</option><option>Administrador</option>
              </select>
            </label>
          )}
          {registro ? (
            <>
              <label>
                Crear contraseña
                <input
                  name="clave"
                  type="password"
                  required
                  minLength={8}
                  placeholder="Crea una contraseña de mínimo 8 caracteres"
                />
              </label>

              <label>
                Confirmar contraseña
                <input
                  name="confirmarClave"
                  type="password"
                  required
                  minLength={8}
                  placeholder="Escribe nuevamente tu contraseña"
                />
              </label>
            </>
          ) : (
            <label>
              Contraseña
              <input
                name="clave"
                type="password"
                required
                placeholder="Ingresa tu contraseña"
              />
            </label>
          )}
          {error && <p className="error" role="alert">{error}</p>}
          <button className="btn btn-lila" type="submit">{registro ? 'Crear mi cuenta' : 'Entrar'}</button>
          <button type="button" className="enlace" onClick={() => { setModo(registro ? 'login' : 'registro'); setError('') }}>
            {registro ? '¿Ya tienes cuenta? Inicia sesión' : '¿Eres nuevo? Crea tu cuenta'}
          </button>
        </form>
      </div>
    </div>
  )
}