import { z } from 'zod'
import { ItemType } from '@prisma/client'

export const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z
    .string()
    .email('Enter a valid email')
    .refine(v => v.toLowerCase().includes('gouni.edu.ng'), {
      message: 'Must be a GOUNI institutional email (@gouni.edu.ng)',
    }),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  facultyId: z.string().optional(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

export const itemAuthorSchema = z.object({
  firstName: z.string().min(1, 'First name required'),
  lastName: z.string().min(1, 'Last name required'),
  email: z.string().email().optional().or(z.literal('')),
  orcid: z
    .string()
    .regex(/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/, 'Invalid ORCID format')
    .optional()
    .or(z.literal('')),
})

export const createItemSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  abstract: z.string().min(100, 'Abstract must be at least 100 characters'),
  type: z.nativeEnum(ItemType),
  year: z.number().int().min(1900).max(new Date().getFullYear()),
  language: z.string().default('English'),
  doi: z.string().optional().or(z.literal('')),
  divisionId: z.string().min(1, 'Division is required'),
  subjectIds: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
  authors: z.array(itemAuthorSchema).min(1, 'At least one author required'),
})

export const updateItemSchema = createItemSchema.partial().extend({
  status: z.enum(['DRAFT', 'UNDER_REVIEW', 'PUBLISHED', 'REJECTED']).optional(),
  rejectionReason: z.string().optional(),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type CreateItemInput = z.infer<typeof createItemSchema>
export type UpdateItemInput = z.infer<typeof updateItemSchema>
