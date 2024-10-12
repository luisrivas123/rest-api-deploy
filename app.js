import express, { json } from 'express'
import { createDatoRouter } from './routes/datos.js'
import { createUserRouter } from './routes/user.js'
import { createAuthRouter } from './routes/auth.js'
import { corsMiddleware } from './middlewares/cors.js'

export const createApp = ({ datoModel }) => {
  const app = express()
  app.use(json())
  app.use(corsMiddleware())
  app.disable('x-powered-by')

  app.get('/', (req, res) => {
    res.send('<h1>Server up</h1>')
  })

  app.use('/datos', createDatoRouter({ datoModel }))
  app.use('/user', createUserRouter({ datoModel }))
  app.use('/login', createAuthRouter({ datoModel }))

  const PORT = process.env.PORT ?? 3000

  app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`)
  })
}
