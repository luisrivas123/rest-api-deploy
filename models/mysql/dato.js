import mysql from 'mysql2/promise'

const config = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: 'password',
  database: 'datosdb'
}

const connection = await mysql.createConnection(config)

export class DatoModel {
  static async getAll ({ genre }) {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase()

      // get genre from database table using genre names
      const [genres] = await connection.query(
        'SELECT id, name FROM genre WHERE LOWER(name) =?;', [lowerCaseGenre]
      )

      // no genre found
      if (genres.length === 0) return []

      // get the id from the first genre result
      const [{ id }] = genres

      // Get all movies ids from database result
      // the query a movie genre_movies
      // join
      // y devolver resultados
      return []
    }
    const [datos] = await connection.query(
      'SELECT title, poster, year, BIN_TO_UUID(id) id FROM dato;'
    )
    return datos
  }

  static async getById ({ id }) {
    const [datos] = await connection.query(
      `SELECT title, poster, year, BIN_TO_UUID(id) id 
        FROM dato WHERE id = UUID_TO_BIN(?);`,
      [id]
    )

    if (datos.length === 0) return null

    return datos[0]
  }

  static async create ({ input }) {
    const {
      title,
      poster,
      // genre: genreInput, // genre is an array
      year
    } = input

    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult

    try {
      await connection.query(
        `INSERT INTO dato (id, title, poster, year)
        VALUES (UUID_TO_BIN("${uuid}"), ?, ?, ?)`,
        [title, poster, year]
      )
    } catch (e) {
      // Pueden enviarle información sensible
      throw new Error('Error creating dato')
      // Enviar la traza a un sercicio interno
      // sendLog(e)
    }

    const [dato] = await connection.query(
      `SELECT title, poster, year, BIN_TO_UUID(id) id 
        FROM dato WHERE id = UUID_TO_BIN(?);`,
      [uuid]
    )

    return dato[0]
  }

  static async delete ({ id }) {

  }

  static async update ({ id, input }) {

  }
}
