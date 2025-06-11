import { zod as z } from 'trpc-cli'

export const projectNameSchema = z
  .string()
  .min(1, 'Project name is required')
  .max(255, 'Project name must be less than 255 characters')
  .refine(
    (name) =>
      name === '.' ||
      !name.startsWith('.') ||
      !name.startsWith('..') ||
      !name.startsWith('-'),
    'Project name cannot start with a dot',
  )
  .refine(
    (name) => !['node_modules', 'package', 'dist', 'build'].includes(name),
    'Project name is reserved',
  )
  .refine((name) => {
    const invalidChars = ['<', '>', ':', '"', '|', '?', '*']
    return !invalidChars.some((char) => name.includes(char))
  }, 'Project name contain invalid characters')
  .describe('Project name')
