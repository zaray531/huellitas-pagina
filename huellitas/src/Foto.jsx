import { useState } from 'react'
import { PawPrint } from 'lucide-react'

// Prueba: foto subida -> /public/img/<nombre>.jpg -> foto real en línea -> ícono
export function Foto({ mascota, className = '' }) {
  const [paso, setPaso] = useState(0)
  const slug = mascota.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '-')
  const fuentes = [
    mascota.foto,
    `/img/${slug}.jpg`,
    `https://loremflickr.com/600/600/${mascota.clave}?lock=${mascota.lock}`,
  ].filter(Boolean)
  if (paso >= fuentes.length) return <div className={`foto-vacia ${className}`}><PawPrint size={40} /></div>
  return <img className={className} src={fuentes[paso]} alt={mascota.nombre} loading="lazy" onError={() => setPaso(paso + 1)} />
}
