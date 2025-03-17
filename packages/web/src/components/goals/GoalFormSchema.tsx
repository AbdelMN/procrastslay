import { z } from 'zod';

export const GoalFormSchema = z
  .object({
    habits: z.array(z.coerce.number()),
    pomodoro: z
      .array(
        z.object({
          duration: z.string(),
          goal: z.coerce.number(),
        }),
      )
      .refine(
        (arr) => new Set(arr.map((item) => item.duration)).size === arr.length,
        {
          message: 'Duration have to be unique',
        },
      ),
    tasks: z
      .array(
        z.object({
          difficulty: z.string(z.enum(['1', '2', '3'])),
          goal: z.coerce.number(),
        }),
      )
      .refine(
        (arr) =>
          new Set(arr.map((item) => item.difficulty)).size === arr.length,
        {
          message: 'Difficulty have to be unique',
        },
      ),
  })
  .refine(
    (data) =>
      data.habits.length > 0 ||
      data.pomodoro.length > 0 ||
      data.tasks.length > 0,
    {
      message:
        'Au moins un des champs (habits, pomodoro, tasks) doit contenir un élément.',
    },
  );

export default GoalFormSchema;
