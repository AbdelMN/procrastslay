import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';
import sessionMiddleware from './auth/sessionMiddleware';
import { prisma } from './prisma';

const app = new Hono();

const GoalSchema = z.object({
  pomodoro: z
    .array(
      z.object({
        duration: z.string(),
        goal: z.number(),
        completed: z.number(),
      }),
    )
    .optional(),
  habit: z.array(z.object({ goal: z.number(), completed: z.number() })),
  task: z
    .array(
      z.object({
        difficulty: z.string(),
        goal: z.number(),
        completed: z.number(),
      }),
    )
    .optional(),
  date: z.string(),
});

app.post('/', zValidator('json', GoalSchema), sessionMiddleware, async (c) => {
  const receivedGoal = c.req.valid('json');

  const user = c.get('user');

  if (user) {
    const userId = user.id;
    const { pomodoro, habit, task, date } = receivedGoal;

    const goal = await prisma.goals.create({
      data: {
        userId,
        pomodoro: pomodoro
          ? pomodoro.map((pomodoro) => JSON.stringify(pomodoro))
          : [],
        habit: habit ? habit.map((habit) => JSON.stringify(habit)) : [],
        task: task ? task.map((task) => JSON.stringify(task)) : [],
        active: true,
        date: new Date(date),
      },
    });

    return c.json(goal);
  }
});

app.get('/current', sessionMiddleware, async (c) => {
  const user = c.get('user');

  if (user) {
    const userId = user.id;

    const receivedGoal = await prisma.goals.findMany({
      where: {
        userId: userId,
        active: true,
      },
    });
    return c.json(receivedGoal);
  }
});

export default app;
