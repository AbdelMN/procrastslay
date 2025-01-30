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
type HabitType = z.infer<typeof HabitSchema>;

const HabitCompletionSchema = z.object({
  habitId: z.string(),
  count: z.number(),
  date: z.string(),
});

const FilterHabitSchema = z.object({
  date: z.string().transform((str) => new Date(str)),
});

app.post('/', zValidator('json', HabitSchema), sessionMiddleware, async (c) => {
  const receivedHabit = c.req.valid('json');

  const user = c.get('user');

  if (user) {
    const userId = user.id;
    const { name, completionMode, goalValue, unit, createdAt, frequencyType } =
      receivedHabit;
    console.log(receivedHabit);
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
          createdAt: new Date(createdAt),
          frequencyType,
          days,
        },
      });
      return c.json(habit);
    }
    return c.text('Invalid data', 400);
  }
});

const isHabitinDate = (habit, date: Date) => {
  switch (habit.frequencyType) {
    case 'interval': {
      const habitDate = new Date(habit.createdAt);
      habitDate.setUTCHours(0, 0, 0, 0);
      date.setUTCHours(0, 0, 0, 0);
      const diffInTime = date.getTime() - habitDate.getTime();

      const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));

      return diffInDays >= 0 && diffInDays % habit.frequencyValue === 0;
    }

    case 'daily': {
      const localDate = date.toLocaleDateString('en-EN', { weekday: 'long' });

      return habit.days.includes(localDate);
    }
    case 'weekly':
      return true;
    default:
      throw new Error('Impossible habit on invalid FrequencyType');
  }
};

app.get('/', sessionMiddleware, async (c) => {
  const user = c.get('user');

  if (user) {
    const userId = user.id;
    const today = new Date();
    const sixDayAgo = new Date();
    sixDayAgo.setDate(today.getDate() - 7);
    const habit = await prisma.habit.findMany({
      where: {
        userId: userId,
      },
      include: {
        completions: {
          where: {
            date: {
              gte: sixDayAgo,
              lte: today,
            },
          },
        },
      },
    });

    return c.json(habit);
  }
});

app.post(
  '/getbydate',
  zValidator('json', FilterHabitSchema),
  sessionMiddleware,
  async (c) => {
    const filter = c.req.valid('json');
    const user = c.get('user');
    const { date } = filter;
    if (user) {
      const userId = user.id;

      const habits = await prisma.habit.findMany({
        where: {
          userId: user.id,
        },
        include: {
          completions: { where: { date } },
        },
      });

      const habitByDate = habits.filter((habit) => isHabitinDate(habit, date));

      return c.json(habitByDate);
    }
  },
);

app.post(
  '/complete',
  zValidator('json', HabitCompletionSchema),
  sessionMiddleware,
  async (c) => {
    const completedHabit = c.req.valid('json');
    const user = c.get('user');
    const { habitId, count, date } = completedHabit;
    if (user) {
      const userId = user.id;

      const result = await prisma.habitCompletion.upsert({
        where: {
          habitId_date: {
            habitId: habitId,
            date: new Date(date),
          },
        },
        update: {
          count,
        },
        create: {
          habitId,
          date: new Date(date),
          count,
        },
      });
      return c.json(result);
    }
  },
);
export default app;
