import express, { json } from 'express'
import { corsMiddleware } from './middlewares/cors.js'

import { datosRouter } from './routes/datos.js'

const PORT = process.env.PORT ?? 3000

const app = express()
app.use(json())
app.use(corsMiddleware())
app.disable('x-powered-by')

app.get('/', (req, res) => {
  res.send('<h1>Server up</h1>')
})

app.use('/datos', datosRouter)

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})
