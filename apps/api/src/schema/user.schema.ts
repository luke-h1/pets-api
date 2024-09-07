import z from '@api/utils/validation';

export const userSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  role: z.enum(['USER', 'ADMIN', 'MODERATOR']),
});

export const payload = {
  body: userSchema
    .omit({
      id: true,
      createdAt: true,
      updatedAt: true,
      role: true,
    })
    .strict(),
};

const params = {
  params: z.object({
    id: z.string({
      required_error: 'ID of the user is required',
      description: 'ID of the user',
    }),
  }),
};

export const getUserSchema = z
  .object({
    ...params,
  })
  .openapi({ description: 'getUserSchema' });

export const updateUserSchema = z
  .object({
    ...params,
    ...payload,
  })
  .openapi({ description: 'updateUserSchema' });

export const deleteUserSchema = z
  .object({
    ...params,
  })
  .openapi({ description: 'deleteUserSchema' });

export type GetUserInput = z.infer<typeof getUserSchema>;
export type PatchUserInput = z.infer<typeof updateUserSchema>;
export type DeleteUserInput = z.infer<typeof deleteUserSchema>;
