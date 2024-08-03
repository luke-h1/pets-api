import { z } from 'zod';

const payload = {
  body: z
    .object({
      name: z.string({
        required_error: 'Name is required',
        description: 'Name of the pet',
      }),
      type: z.string({
        required_error: 'type is required',
        description: 'type of the pet',
      }),
      breed: z.string(),
      status: z.enum(['available', 'pending', 'adopted']),
      birthYear: z.number(),
      photoUrl: z.string(),
      tags: z.array(
        z.string({
          description: 'Tags of the pet',
        }),
      ),
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
