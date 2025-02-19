import { Hono } from 'hono';
import { getCookie } from 'hono/cookie';
const app = new Hono();
import { validateSessionToken } from './auth/sessions';
import { prisma } from './prisma';
import sessionMiddleware from './auth/sessionMiddleware';
import rewardsMiddleware from './rewardsMiddleware';
import { addOrRemoveUserFuel, addUserFuel } from './services/userService';

app.get('/', sessionMiddleware, async (c) => {
  const user = c.get('user');
  if (user) {
    const result = await prisma.task.findMany({
      where: {
        userId: user.id,
      },
    });
    return c.json(result);
  }
});

app.post('/', sessionMiddleware, async (c) => {
  const body = await c.req.json();
  const user = c.get('user');
  if (user) {
    const title = body.title;
    const difficulty: string = body.difficulty;
    const tasklistId = body.tasklistId;
    const dueDate = body.dueDate;
    const userId = user.id;

    const tasklist = await prisma.task.create({
      data: {
        title,
        difficulty,
        userId,
        tasklistId,
        dueDate,
      },
    });
    return c.json(tasklist);
  }
});

app.post('/delete', sessionMiddleware, async (c) => {
  const body = await c.req.json();
  const user = c.get('user');
  if (user) {
    const id = body.id;
    const userId = user.id;

    const tasklist = await prisma.task.delete({
      where: {
        id: id,
        userId: user.id,
      },
    });
    return c.json(tasklist);
  }
});

app.post('/complete', sessionMiddleware, rewardsMiddleware, async (c) => {
  const user = c.get('user');
  const body = await c.req.json();

  if (user) {
    const userId = user.id;
    const rewards = c.get('rewards');
    const completed = body.completed;
    const difficulty = body.difficulty;
    const habitId = body.habitId;
    const completedTaskList = await prisma.task.update({
      where: { id: habitId, userId: userId },
      data: {
        completed,
        ...(completed ? { completedAt: new Date() } : {}),
        difficulty,
      },
    });

    const completedAt =
      !completed && completedTaskList.completedAt
        ? completedTaskList.completedAt
        : undefined;

    switch (difficulty) {
      case '1':
        await addOrRemoveUserFuel(
          completed,
          userId,
          rewards.task.easy,
          completedAt,
        );
        break;
      case '2':
        await addOrRemoveUserFuel(
          completed,
          userId,
          rewards.task.medium,
          completedAt,
        );
        break;
      case '3':
        await addOrRemoveUserFuel(
          completed,
          userId,
          rewards.task.hard,
          completedAt,
        );
    }

    return c.json(completedTaskList);
  }
});

app.patch('/:id', sessionMiddleware, async (c) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  const user = c.get('user');
  if (user) {
    const title = body.title;
    const difficulty = body.difficulty;
    const tasklistId = body.tasklistId;
    const completed = body.completed;
    const dueDate = body.dueDate;
    const userId = user.id;
    const editedTaskList = await prisma.task.update({
      where: {
        id: id,
        userId: user.id,
      },
      data: {
        title,
        difficulty,
        tasklistId,
        dueDate,
        completed,
      },
    });
    return c.json(editedTaskList);
  }
});
export default app;
