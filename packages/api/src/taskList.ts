import { Hono } from 'hono';
import { getCookie } from 'hono/cookie';
const app = new Hono();
import { validateSessionToken } from './auth/sessions';
import { prisma } from './prisma';
import sessionMiddleware from './auth/sessionMiddleware';

app.get('/', sessionMiddleware, async (c) => {
  const user = c.get('user');
  if (user) {
    const result = await prisma.tasklist.findMany({
      orderBy: [
        {
          id: 'asc',
        },
      ],
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
    const userId = user.id;

    const tasklist = await prisma.tasklist.create({
      data: {
        title,
        userId,
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

    const tasklist = await prisma.tasklist.delete({
      where: {
        id: id,
        userId: user.id,
      },
    });
    return c.json(tasklist);
  }
});
app.patch('/:id', sessionMiddleware, async (c) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  const user = c.get('user');
  if (user) {
    const title = body.title;

    const userId = user.id;
    const editedTaskList = await prisma.tasklist.update({
      where: {
        id: id,
        userId: user.id,
      },
      data: {
        title: title,
      },
    });
    return c.json(editedTaskList);
  }
});

app.get('/:id/tasks', sessionMiddleware, async (c) => {
  const { id } = c.req.param();

  const tasklistId = id;
  const user = c.get('user');
  if (user) {
    const userId = user.id;
    const result = await prisma.task.findMany({
      orderBy: [
        {
          id: 'asc',
        },
      ],
      where: {
        userId: user.id,
        tasklistId: tasklistId,
      },
    });
    return c.json(result);
  }
});
export default app;
