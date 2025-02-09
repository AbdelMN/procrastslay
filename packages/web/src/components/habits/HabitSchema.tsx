import { z } from 'zod';

export const HabitSchema = z
  .object({
    name: z.string(),
    completionMode: z.string(),
    goalValue: z.coerce.number().positive(),
    unit: z.string().optional(),
    createdAt: z.string(),
    frequencyType: z.enum(['interval', 'weekly', 'daily']),
  })
  .and(
    z.discriminatedUnion('frequencyType', [
      z.object({
        frequencyType: z.literal('daily'),
        days: z.array(z.enum(['mo', 'tu', 'we', 'th', 'sa', 'su'])),
      }),
      z.object({
        frequencyType: z.enum(['interval', 'weekly']),
        frequencyValue: z.coerce.number().positive(),
      }),
    ]),
  );

export type HabitType = z.infer<typeof HabitSchema>;
