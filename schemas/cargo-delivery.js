import z from 'zod'

const dataSchema = z.object({
  type_of_cargo_transport: z.string({
    invalid_type_error: 'Type of cargo transport must be a string',
    required_error: 'Type of cargo transport is required'
  }),
  type_cargo: z.string({
    invalid_type_error: 'Type cargo must be a string',
    required_error: 'Type cargo is required'
  }),
  description_cargo: z.string({
    invalid_type_error: 'The description cargo must be a string',
    required_error: 'The description cargo title is required'
  }),
  oringin_cargo: z.string({
    invalid_type_error: 'Oringin cargo must be a string',
    required_error: 'Oringin cargo is required'
  }),
  destiny_cargo: z.string({
    invalid_type_error: 'Destiny cargo must be a string',
    required_error: 'Destiny cargo is required'
  }),
  height_cargo: z.string(),
  length_cargo: z.string(),
  width_cargo: z.string(),
  weight_cargo: z.string(),
  with_load: z.string(),
  with_schedule: z.string(),
  payment_method: z.string()
})

export function validateData(input) {
  return dataSchema.safeParse(input)
}

export function validatePartialData(input) {
  return dataSchema.partial().safeParse(input)
}
