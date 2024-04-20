const express = require('express')
const crypto = require('node:crypto')
const cors = require('cors')

const datos = require('./datos.json')
const { validateData, validatePartialData } = require('./schemas/datos')
const PORT = process.env.PORT ?? 3000

const app = express()
app.use(express.json())
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:5500',
      'http://localhost:8080'
    ]

    if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allow by CORS'))
  }
}))
app.disable('x-powered-by')

// const ACCEPTED_ORIGINS = [
//   'http://localhost:5500',
//   'http://localhost:8080'
// ]

app.get('/', (req, res) => {
  res.send('<h1>Server up</h1>')
})

app.get('/datos', (req, res) => {
  // const origin = req.header('origin')
  // if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
  //   res.header('Access-Control-Allow-Origin', origin)
  // }

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

app.get('/datos/:id', (req, res) => { // path-to-regexp
  const { id } = req.params
  const dato = datos.find(dato => dato.id === id)
  if (dato) return res.json(dato)

  res.status(404).json({ message: 'movie not found' })
})

app.post('/datos', (req, res) => {
  const result = validateData(req.body)

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const newData = {
    id: crypto.randomUUID(), // uuid v4
    ...result.data
  }

  datos.push(newData)

  res.status(201).json(newData)
})

app.patch('/datos/:id', (req, res) => { // path-to-regexp
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

app.delete('/datos/:id', (req, res) => {
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

// app.options('/datos/:id', (req, res) => {
//   const origin = req.header('origin')

//   if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
//     res.header('Access-Control-Allow-Origin', origin)
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
//   }
//   res.sendStatus(200)
// })

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})
