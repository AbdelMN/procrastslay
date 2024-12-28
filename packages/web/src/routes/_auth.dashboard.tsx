import { createFileRoute } from '@tanstack/react-router';

import { useAuth } from '../auth';

import { Box } from '@chakra-ui/react';
export const Route = createFileRoute('/_auth/dashboard')({
  component: DashboardPage,
});

function DashboardPage() {
  const auth = useAuth();
  if (!auth.user) {
    return <p> Vous n'êtes pas connecté </p>;
  }

  return (
    <Box p="4">
      <h1>Authenticated route</h1>
      <p>Welcome to the dashboard</p>
    </Box>
  );
}
