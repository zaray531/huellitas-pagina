import { useMemo, useState } from 'react'
import { LayoutDashboard, PawPrint, CalendarClock, ClipboardList, LogOut, Search, Dog, Cat, Rabbit, History, Plus, X, Upload } from 'lucide-react'
import { Foto } from './Foto.jsx'
import { inicial, citas } from './data.js'

const menu = [
  { id: 'panel', texto: 'Panel', Icono: LayoutDashboard },
  { id: 'adopciones', texto: 'Adopciones', Icono: PawPrint },
  { id: 'citas', texto: 'Citas', Icono: CalendarClock },
  { id: 'registro', texto: 'Registro', Icono: ClipboardList },
]
const tabs = [
  { id: 'Recientes', Icono: History }, { id: 'Perro', texto: 'Perros', Icono: Dog },
  { id: 'Gato', texto: 'Gatos', Icono: Cat }, { id: 'Otro', texto: 'Otros', Icono: Rabbit },
]

function Grilla({ lista }) {
  if (!lista.length) return <p className="vacio">No hay mascotas para mostrar. Registra una nueva desde la sección Registro.</p>
  return (
    <div className="grilla">
      {lista.map((m) => (
        <article className="mascota" key={m.id}>
          <Foto mascota={m} />
          <div className="mascota-info">
            <h3>{m.nombre}</h3>
            <p>{m.raza} · {m.edad} · {m.genero}</p>
            <span className={m.estado === 'Adoptado' ? 'estado ok' : 'estado'}>{m.estado}</span>
          </div>
        </article>
      ))}
    </div>
  )
}

function Registro({ onGuardar, onCerrar }) {
  const id = useMemo(() => 900000 + Math.floor(Math.random() * 99999), [])
  const [foto, setFoto] = useState('')
  const campo = (nombre, etiqueta, opciones, extra = {}) => (
    <label>{etiqueta}
      {opciones
        ? <select name={nombre} required defaultValue=""><option value="" disabled>Seleccionar</option>{opciones.map((o) => <option key={o}>{o}</option>)}</select>
        : <input name={nombre} required {...extra} />}
    </label>
  )
  const enviar = (e) => {
    e.preventDefault()
    const d = Object.fromEntries(new FormData(e.target))
    const claves = { Perro: 'dog', Gato: 'cat', Otro: 'rabbit' }
    onGuardar({ id, nombre: d.nombre, tipo: d.tipo, raza: d.raza, edad: `${d.edad} años`, genero: d.genero, estado: 'En adopción', foto, clave: claves[d.tipo], lock: id % 100 })
  }
  return (
    <form className="tarjeta-form" onSubmit={enviar}>
      <button type="button" className="cerrar" onClick={onCerrar} aria-label="Cerrar"><X /></button>
      <h2>Registrar mascota <span>ID#{id}</span></h2>
      <div className="cols">
        <div className="fila">
          {campo('nombre', 'Nombre de la mascota')}
          {campo('tipo', 'Tipo', ['Perro', 'Gato', 'Otro'])}
          {campo('raza', 'Raza')}
          {campo('genero', 'Género', ['Hembra', 'Macho'])}
          {campo('edad', 'Edad (años)', null, { type: 'number', min: 0 })}
          {campo('peso', 'Peso (kg)', null, { type: 'number', min: 0, step: '0.1' })}
        </div>
        <div className="fila">
          {campo('tamano', 'Tamaño', ['Pequeño', 'Mediano', 'Grande'])}
          {campo('color', 'Color')}
          {campo('pelaje', 'Pelaje', ['Corto', 'Medio', 'Largo'])}
          {campo('esterilizado', 'Esterilizado', ['Sí', 'No'])}
          {campo('microchip', 'Microchip #')}
          {campo('rabia', 'Carné de rabia #')}
        </div>
      </div>
      <h3 className="sub-form">Información del dueño</h3>
      <div className="cols">
        <div className="fila">
          {campo('dueno', 'Nombre completo')}
          {campo('direccion', 'Dirección')}
        </div>
        <div className="subir">
          <div className="vista">{foto ? <img src={foto} alt="Vista previa" /> : <PawPrint size={36} />}</div>
          <div>
            <strong>Subir foto</strong>
            <small>JPG o PNG, máximo 2 MB</small>
            <label className="btn btn-gris"><Upload size={18} /> Elegir foto
              <input type="file" accept="image/png,image/jpeg" hidden onChange={(e) => {
                const f = e.target.files[0]
                if (f && f.size <= 2 * 1024 * 1024) setFoto(URL.createObjectURL(f))
              }} />
            </label>
          </div>
        </div>
      </div>
      <button className="btn btn-lila ancho" type="submit"><Plus size={18} /> Guardar mascota</button>
    </form>
  )
}

export default function Dashboard({ usuario, onSalir }) {
  const [vista, setVista] = useState('panel')
  const [tab, setTab] = useState('Recientes')
  const [q, setQ] = useState('')
  const [mascotas, setMascotas] = useState(inicial)
  const [aviso, setAviso] = useState('')

  const filtradas = mascotas
    .filter((m) => (vista === 'adopciones' ? m.estado === 'En adopción' : tab === 'Recientes' || m.tipo === tab))
    .filter((m) => `${m.nombre} ${m.raza}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => b.id - a.id)
  const enAdopcion = mascotas.filter((m) => m.estado === 'En adopción').length

  const guardar = (m) => {
    setMascotas([m, ...mascotas]); setVista('panel'); setTab('Recientes')
    setAviso(`${m.nombre} fue registrada correctamente.`)
    setTimeout(() => setAviso(''), 3500)
  }

  return (
    <div className="app">
      <aside className="lateral">
        <span className="logo"><PawPrint /> Huellitas</span>
        <nav>
          {menu.map(({ id, texto, Icono }) => (
            <button key={id} className={vista === id ? 'item activo' : 'item'} onClick={() => setVista(id)}>
              <Icono size={22} /> {texto}
              {id === 'adopciones' && <span className="insignia">{enAdopcion}</span>}
            </button>
          ))}
          <button className="item" onClick={onSalir}><LogOut size={22} /> Cerrar sesión</button>
        </nav>
        <div className="perfil">
          <span className="avatar">{usuario.nombre.charAt(0).toUpperCase()}</span>
          <div><strong>{usuario.nombre}</strong><small>{usuario.rol}</small></div>
        </div>
      </aside>

      <main className="contenido">
        <label className="buscar"><Search size={22} />
          <input placeholder="Buscar por nombre o raza" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar" />
        </label>
        {aviso && <div className="aviso" role="status">{aviso}</div>}

        {vista === 'panel' && (
          <>
            <div className="barra-tabs">
              <div className="tabs">
                {tabs.map(({ id, texto, Icono }) => (
                  <button key={id} className={tab === id ? 'tab activo' : 'tab'} onClick={() => setTab(id)}><Icono size={22} /> {texto || id}</button>
                ))}
              </div>
              <button className="btn btn-tinta" onClick={() => setVista('registro')}><Plus size={18} /> Registrar mascota</button>
            </div>
            <Grilla lista={filtradas} />
          </>
        )}
        {vista === 'adopciones' && <><h1 className="titulo">Mascotas en adopción</h1><Grilla lista={filtradas} /></>}
        {vista === 'citas' && (
          <>
            <h1 className="titulo">Citas de hoy</h1>
            <ul className="citas">
              {citas.map((c) => (
                <li key={c.hora}><strong>{c.hora}</strong><div><b>{c.mascota}</b><span>{c.motivo}</span></div><small>{c.dueno}</small></li>
              ))}
            </ul>
          </>
        )}
        {vista === 'registro' && <Registro onGuardar={guardar} onCerrar={() => setVista('panel')} />}
      </main>
    </div>
  )
}
