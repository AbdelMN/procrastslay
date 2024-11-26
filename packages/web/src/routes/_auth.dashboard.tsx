
import { createFileRoute } from '@tanstack/react-router'

import { useAuth } from '../auth'

export const Route = createFileRoute('/_auth/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const auth = useAuth()
  
  return (
    <p>Bonjour {auth.user.githubUsername}</p>
  )
}
