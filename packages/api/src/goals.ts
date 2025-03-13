import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';
import sessionMiddleware from './auth/sessionMiddleware';
import { prisma } from './prisma';
import { addStreak, getUserFuel, resetStreak } from './services/userService';
import { addTrainFuel } from './services/trainService';

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

const cancelGoal = async (userId: string) => {
  const goal = await prisma.goals.findMany({ where: { userId, active: true } });

  return await prisma.goals.update({
    where: { id: goal[0].id },
    data: { active: false },
  });
};

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

app.post('/achieve', sessionMiddleware, async (c) => {
  const user = c.get('user');

  if (user) {
    const userId = user.id;

    const goal = await prisma.goals.findMany({
      where: { userId: userId, active: true },
      select: { pomodoro: true, task: true, habit: true },
    });

    const totals = Object.values(goal[0]).reduce(
      (totals, categoryItems) => {
        if (!categoryItems.length) return totals;
        const parsedCategoryItems = categoryItems.map((item) =>
          JSON.parse(item),
        );

        totals.totalCompleted += parsedCategoryItems.reduce(
          (sum, item) => sum + item.completed,
          0,
        );
        totals.totalGoal += parsedCategoryItems.reduce(
          (sum, item) => sum + item.goal,
          0,
        );
        console.log(totals);
        return totals;
      },
      { totalCompleted: 0, totalGoal: 0 },
    );

    const completionPourcentage =
      (totals.totalCompleted * totals.totalGoal) / 100;
    const userFuel = await getUserFuel(userId);

    if (completionPourcentage < 60) {
      resetStreak(userId);
      addTrainFuel(userId, userFuel * 0.5);
    }
    if (completionPourcentage < 100) {
      addStreak(userId);

      addTrainFuel(userId, userFuel);
    }

    addStreak(userId);
    addTrainFuel(userId, userFuel * 1.5);
    return c.json(cancelGoal(userId));
  }
});

export default app;
