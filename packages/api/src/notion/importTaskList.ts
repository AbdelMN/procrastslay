import { Hono } from 'hono';
import { getCookie } from 'hono/cookie';
const app = new Hono();
import { validateSessionToken } from '../auth/sessions';
import { prisma } from '../prisma';
app.get('/', async (c) => {
  const session = getCookie(c, 'session');
  if (session) {
    const user = await validateSessionToken(session);
    if (user.user) {
      const accessToken = user.user.notionAccessToken;
      const dbResponse = await fetch('https://api.notion.com/v1/search', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28',
        },
        body: JSON.stringify({
          filter: {
            property: 'object',
            value: 'database',
          },
        }),
      });

      const dbData = await dbResponse.json();
      const returnDb = dbData.results.map((db) => ({
        id: db.id,
        title: db.title[0].text.content,
      }));
      console.log(returnDb);
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
      const notionDbId: string = body.notionDb.id;
      const userId: number = user.user.id;
      const notionApiResponse = await fetch(
        `https://api.notion.com/v1/databases/${notionDbId}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Notion-Version': '2022-06-28',
          },
        },
      );
      const dbData = await notionApiResponse.json();
      const notionDbName: string = dbData.title[0].text.content;
      const type = 'notion';
      const database = await prisma.databases.create({
        data: {
          type,
          notionDbId,
          notionDbName,
          userId,
        },
      });
      console.log(database);
    }
  }
});
export default app;
