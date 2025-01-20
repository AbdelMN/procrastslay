import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';
import { prisma } from './prisma';
import sessionMiddleware from './auth/sessionMiddleware';

const app = new Hono();

const HabitSchema = z
  .object({
    name: z.string(),
    completionMode: z.string(),
    goalValue: z.number(),
    unit: z.string().optional(),
    createdAt: z.string(),
    frequencyType: z.enum(['interval', 'weekly', 'daily']),
  })
  .and(
    z.union([
      z.object({
        frequencyType: z.literal('daily'),
        days: z.array(z.string()),
      }),
      z.object({
        frequencyType: z.enum(['interval', 'weekly']),
        frequencyValue: z.number(),
      }),
    ]),
  );

const FilterHabitSchema = z.object({
  day: z.string().optional(),
});

app.post('/', zValidator('json', HabitSchema), sessionMiddleware, async (c) => {
  const receivedHabit = c.req.valid('json');

  const user = c.get('user');

  if (user) {
    const userId = user.id;
    const { name, completionMode, goalValue, unit, createdAt, frequencyType } =
      receivedHabit;

    if (frequencyType === 'interval' || frequencyType === 'weekly') {
      const { frequencyValue } = receivedHabit;
      const habit = await prisma.habit.create({
        data: {
          name,
          completionMode,
          goalValue,
          unit,
          userId,
          createdAt: new Date(createdAt),
          frequencyType,
          frequencyValue,
          days: [''],
        },
      });
      return c.json(habit);
    }
    if (frequencyType === 'daily') {
      const { days } = receivedHabit;
      const habit = await prisma.habit.create({
        data: {
          name,
          completionMode,
          goalValue,
          unit,
          userId,
          createdAt,
          frequencyType,
          days,
        },
      });
      return c.json(habit);
    }
    return c.text('Invalid data', 400);
  }
});

app.get('/', sessionMiddleware, async (c) => {
  const user = c.get('user');

  if (user) {
    const userId = user.id;

    const habit = await prisma.habit.findMany({
      where: {
        userId: user.id,
      },
    });

    return c.json(habit);
  }
});

export default app;
