import { z } from 'zod';

const payload = {
  body: z
    .object({
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

export const createPetSchema = z.object({
  ...payload,
});

export const updatePetSchema = z.object({
  ...params,
  ...payload,
});

export const getPetSchema = z.object({
  ...params,
});

export const deletePetSchema = z.object({
  ...params,
});

export type CreatePetInput = z.infer<typeof createPetSchema>;
export type UpdatePetInput = z.infer<typeof updatePetSchema>;
export type GetPetInput = z.infer<typeof getPetSchema>;
export type DeletePetInput = z.infer<typeof deletePetSchema>;
