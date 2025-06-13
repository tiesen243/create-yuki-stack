import { zod as z } from 'trpc-cli'

export const projectNameSchema = z
  .string()
  .min(1, 'Project name is required')
  .max(255, 'Project name must be less than 255 characters')
  .refine(
    (name) => name === '.' || !name.startsWith('.'),
    "Project name cannot start with a dot (except for '.')",
  )
  .refine(
    (name) => name === '.' || !name.startsWith('-'),
    'Project name cannot start with a dash',
  )
  .refine(
    (name) =>
      !['node_modules', 'package', 'dist', 'build'].includes(
        name.toLowerCase(),
      ),
    'Project name is reserved',
  )
  .refine((name) => {
    return !['<', '>', ':', '"', '|', '?', '*'].some((char) =>
      name.includes(char),
    )
  }, 'Project name contain invalid characters')
  .describe('Project name')
