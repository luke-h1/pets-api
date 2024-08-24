import z from '../utils/validation';

export const responseSchema = z.object({
  title: z.string(),
  type: z.string(),
  statusCode: z.number(),
  code: z.string(),
  message: z.string(),
  erros: z.array(z.object({})).optional(),
});
