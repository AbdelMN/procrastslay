import { createFileRoute } from '@tanstack/react-router';

import { useAuth } from '../../auth';

import { Box } from '@chakra-ui/react';
import Goal from '@/components/goals/Goal';
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
      <Goal />
    </Box>
  );
}
