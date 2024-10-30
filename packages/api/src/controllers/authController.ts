import { Hono, Context } from 'hono';
import {
  authHandler,
  initAuthConfig,
  verifyAuth,
  type AuthConfig,
} from '@hono/auth-js';
import GitHub from '@auth/core/providers/github';

const app = new Hono();

app.use('*', initAuthConfig(getAuthConfig));

app.use('/api/auth/*', authHandler());

app.use('/api/*', verifyAuth());

app.get('/api/protected', (c) => {
  const auth = c.get('authUser');
  return c.json(auth);
});

function getAuthConfig(c: Context): AuthConfig {
  return {
    secret: c.env.AUTH_SECRET,
    providers: [
      GitHub({
        clientId: c.env.GITHUB_ID,
        clientSecret: c.env.GITHUB_SECRET,
      }),
    ],
  };
}

export default app;
