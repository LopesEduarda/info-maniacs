import { z } from 'zod'

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Título é obrigatório')
    .max(255, 'Título deve ter no máximo 255 caracteres'),
  description: z
    .string()
    .max(5000, 'Descrição deve ter no máximo 5000 caracteres')
    .optional()
    .nullable()
    .default(''),
  status: z
    .enum(['pending', 'in_progress', 'completed'])
    .default('pending')
    .optional(),
})

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Título é obrigatório')
    .max(255, 'Título deve ter no máximo 255 caracteres')
    .optional(),
  description: z
    .string()
    .max(5000, 'Descrição deve ter no máximo 5000 caracteres')
    .optional()
    .nullable(),
  status: z
    .enum(['pending', 'in_progress', 'completed'])
    .optional(),
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
