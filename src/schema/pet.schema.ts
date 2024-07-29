import { z } from 'zod';

const payload = {
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
      description: 'Name of the pet',
    }),
    description: z.string({
      required_error: 'Description is required',
      description: 'Description of the pet',
    }),
    age: z.number({
      required_error: 'Age is required',
      description: 'Age of the pet',
    }),
    breed: z.string({
      required_error: 'Breed is required',
      description: 'Breed of the pet',
    }),
    available: z.boolean({
      required_error: 'Available is required',
      description: 'Availability of the pet',
    }),
    species: z.string({
      required_error: 'Species is required',
      description: 'Species of the pet',
    }),
    tags: z.array(
      z.string({
        description: 'Tags of the pet',
      }),
    ),
  }),
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
