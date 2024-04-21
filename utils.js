// Como leer json ESModules recomendado
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
export const readJSON = (path) => require(path)

// Como leer json ESModules
// import fs from 'node:fs'
// const datos = JSON.parse(fs.readFileSync('./datos.json', 'utf-8'))
