import { Hono } from 'hono';
import { getCookie } from 'hono/cookie';
const app = new Hono();
import { validateSessionToken } from './auth/sessions';
import { prisma } from './prisma';

app.get('/', async (c) => {
  const session = getCookie(c, 'session');
  if (session) {
    const user = await validateSessionToken(session);
    if (user.user) {
      const result = await prisma.tasklist.findMany({
        orderBy: [
          {
            id: 'asc',
          },
        ],
        where: {
          userId: user.user.id,
        },
      });
      return c.json(result);
    }
  }
});

app.post('/', async (c) => {
  const body = await c.req.json();
  const session = getCookie(c, 'session');
  if (session) {
    const user = await validateSessionToken(session);
    if (user.user) {
      const title = body.title;
      const userId = user.user.id;

      const tasklist = await prisma.tasklist.create({
        data: {
          title,
          userId,
        },
      });
      return c.json(tasklist);
    }
  }
});
app.post('/delete', async (c) => {
  const body = await c.req.json();
  const session = getCookie(c, 'session');
  if (session) {
    const user = await validateSessionToken(session);
    if (user.user) {
      const id = body.id;
      const userId = user.user.id;

      const tasklist = await prisma.tasklist.delete({
        where: {
          id: id,
          userId: user.user.id,
        },
      });
      return c.json(tasklist);
    }
  }
});
app.patch('/:id', async (c) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  const session = getCookie(c, 'session');
  if (session) {
    const user = await validateSessionToken(session);
    if (user.user) {
      const title = body.title;

      const userId = user.user.id;
      const editedTaskList = await prisma.tasklist.update({
        where: {
          id: +id,
          userId: user.user.id,
        },
        data: {
          title: title,
        },
      });
      return c.json(editedTaskList);
    }
  }
});

app.get('/:id/tasks', async (c) => {
  const { id } = c.req.param();
  const session = getCookie(c, 'session');
  if (session) {
    const tasklistId = +id;
    const user = await validateSessionToken(session);
    if (user.user) {
      const userId = user.user.id;
      const result = await prisma.task.findMany({
        orderBy: [
          {
            id: 'asc',
          },
        ],
        where: {
          userId: user.user.id,
          tasklistId: tasklistId,
        },
      });
      return c.json(result);
    }
  }
});
export default app;
