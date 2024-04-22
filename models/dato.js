import { randomUUID } from 'node:crypto'
import { readJSON } from '../utils.js'

const datos = readJSON('./datos.json')

// Futuro
// import datos from './datos.json' with {type: 'json'}

export class DatoModel {
  // static getAll = async ({ genre }) => {
  static async getAll ({ genre }) {
    if (genre) {
      return datos.filter(
        dato => dato.genre.some(g => g.toLowerCase() === genre.toLowerCase())
      )
    }
    return datos
  }

  static async getById ({ id }) {
    const dato = datos.find(dato => dato.id === id)
    if (dato) return dato
  }

  static async create ({ input }) {
    const newData = {
      id: randomUUID(), // uuid v4
      ...input
    }
    datos.push(newData)
    return newData
  }

  static async delete ({ id }) {
    const datoIndex = datos.findIndex(dato => dato.id === id)
    if (datoIndex === -1) return false

    datos.splice(datoIndex, 1)
    return true
  }

  static async update ({ id, input }) {
    const datoIndex = datos.findIndex(dato => dato.id === id)

    if (datoIndex === -1) return false

    datos[datoIndex] = {
      ...datos[datoIndex],
      ...input
    }

    return datos[datoIndex]
  }
}
