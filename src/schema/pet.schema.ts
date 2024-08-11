import z from '../util/validation';

export const petSchema = z
  .object({
    id: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    creatorId: z.string(),
    name: z.string({
      required_error: 'Name is required',
      description: 'Name of the pet',
    }),
    breed: z.string(),
    status: z.enum(['AVAILABLE', 'PENDING', 'ADOPTED']),
    birthDate: z.string(),
    photoUrl: z.string(),
    age: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
  })
  .openapi('pet');

export const payload = {
  body: petSchema
    .omit({
      id: true,
      createdAt: true,
      updatedAt: true,
      creatorId: true,
    })
    .strict(),
};

const params = {
  params: z.object({
    id: z.string({
      required_error: 'ID is required',
      description: 'ID of the pet',
    }),
  }),
};

export const createPetSchema = z
  .object({
    ...payload,
  })
  .openapi({ description: 'createPetSchema' });

export const updatePetSchema = z
  .object({
    ...params,
    ...payload,
  })
  .openapi({ description: 'updatePetSchema' });

export const getPetSchema = z
  .object({
    ...params,
  })
  .openapi({ description: 'getPetSchema' });

export const deletePetSchema = z
  .object({
    ...params,
  })
  .openapi({ description: 'deletePetSchema' });

export type CreatePetInput = z.infer<typeof createPetSchema>;
export type UpdatePetInput = z.infer<typeof updatePetSchema>;
export type GetPetInput = z.infer<typeof getPetSchema>;
export type DeletePetInput = z.infer<typeof deletePetSchema>;
