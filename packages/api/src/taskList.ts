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
      const result = await prisma.databases.findMany({
        where: {
          userId: user.user.id,
        },
      });
      console.log(result);
    }
  }
});

app.post('/', async (c) => {
  const body = await c.req.json();
  const session = getCookie(c, 'session');
  if (session) {
    const user = await validateSessionToken(session);
    if (user.user) {
      const accessToken = user.user.notionAccessToken;
      const dbId = body.db.notionDbId;
      console.log(dbId);
      const notionApiResponse = await fetch(
        `https://api.notion.com/v1/databases/${dbId}/query`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Notion-Version': '2022-06-28',
          },
        },
      );
      const dbData = await notionApiResponse.json();
      console.log(dbData.results[2].properties.Task);
    }
  }
});

export default app;
