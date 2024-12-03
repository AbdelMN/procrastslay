import * as React from 'react';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';
import { Button } from '@/components/ui/button';

const fallback = '/dashboard' as const;

export const Route = createFileRoute('/login')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isLoggedIn) {
      throw redirect({ to: search.redirect || fallback });
    }
  },
  component: LoginComponent,
});

function LoginComponent() {
  return (
    <>
      <div>
        <Button
          onClick={() =>
            (window.location.href = 'http://localhost:3000/auth/github')
          }
        >
          Login
        </Button>
      </div>
      <div>
        <Button
          onClick={() =>
            (window.location.href = 'http://localhost:3000/auth/notion')
          }
        >
          Notion
        </Button>
      </div>
    </>
  );
}
