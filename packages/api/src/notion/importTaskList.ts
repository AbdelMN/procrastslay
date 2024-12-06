import { Hono } from 'hono';
import { getCookie } from 'hono/cookie';
const app = new Hono();
import { validateSessionToken } from '../auth/sessions';
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

export default app;
