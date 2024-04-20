const z = require('zod')

const dataSchema = z.object({
  title: z.string({
    invalid_type_error: 'Movie title must be a string',
    required_error: 'Movie title is required'
  }),
  poster: z.string().url(),
  genre: z.array(
    z.enum(['Action', 'Terror', 'genero_1', 'genero_2', 'genero_3']),
    {
      required_error: 'Movie genre is required',
      invalid_type_error: 'movie genre must be array of enum genre'
    }
  ),
  year: z.number().int().positive().min(1900).max(2024)
})

function validateData (input) {
  return dataSchema.safeParse(input)
}

function validatePartialData (input) {
  return dataSchema.partial().safeParse(input)
}

module.exports = {
  validateData,
  validatePartialData
}
