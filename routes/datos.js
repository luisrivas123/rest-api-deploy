import { Router } from 'express'
import { randomUUID } from 'node:crypto'
import { readJSON } from '../utils.js'
import { validateData, validatePartialData } from '../schemas/datos.js'

// Futuro
// import datos from './datos.json' with {type: 'json'}

const datos = readJSON('./datos.json')

export const datosRouter = Router()

datosRouter.get('/', (req, res) => {
  const { genre } = req.query
  if (genre) {
    const filteredMovies = datos.filter(
    //   movie => movie.genre.includes(genre)
      dato => dato.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    )
    return res.json(filteredMovies)
  }
  res.json(datos)
})

datosRouter.get('/:id', (req, res) => { // path-to-regexp
  const { id } = req.params
  const dato = datos.find(dato => dato.id === id)
  if (dato) return res.json(dato)

  res.status(404).json({ message: 'movie not found' })
})

datosRouter.post('/', (req, res) => {
  const result = validateData(req.body)

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const newData = {
    id: randomUUID(), // uuid v4
    ...result.data
  }

  datos.push(newData)

  res.status(201).json(newData)
})

datosRouter.patch('/:id', (req, res) => { // path-to-regexp
  const result = validatePartialData(req.body)

  if (!result.success) {
    return res.status(404).json({ error: JSON.parse(result.error.message) })
  }

  const { id } = req.params
  const datoIndex = datos.findIndex(dato => dato.id === id)

  if (datoIndex === -1) {
    return res.status(404).json({ message: 'movie not found' })
  }

  const updateDate = {
    ...datos[datoIndex],
    ...result.data
  }

  datos[datoIndex] = updateDate

  return res.json(updateDate)
})

datosRouter.delete('/:id', (req, res) => {
  // const origin = req.header('origin')
  // if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
  //   res.header('Access-Control-Allow-Origin', origin)
  // }

  const { id } = req.params
  const datoIndex = datos.findIndex(dato => dato.id === id)

  if (datoIndex === -1) {
    return res.status(400).json({ error: 'Dato not found' })
  }

  datos.splice(datoIndex, 1)
  return res.json({ message: 'Dato delete' })
})
