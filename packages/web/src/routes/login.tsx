import * as React from 'react'
import {
  createFileRoute,
  redirect,
  useRouter,
  useRouterState,
} from '@tanstack/react-router'
import { z } from 'zod'
import { Button } from "@/components/ui/button"
import { useAuth } from '../auth'
import { sleep } from '../utils'

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
const fallback = '/dashboard' as const

export const Route = createFileRoute('/login')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isLoggedIn) {
      throw redirect({ to: search.redirect || fallback })
    }
  },
  component: LoginComponent,
})

function LoginComponent() {
    return (
        <div>
          <Button onClick={() => window.location.href = 'http://localhost:3000/auth/github'}>Login</Button>
        </div>
)}