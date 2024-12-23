import { createFileRoute } from '@tanstack/react-router';
import TaskList from '../components/tasks/tasklist';
import { useAuth } from '../auth';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { Box, Flex } from '@chakra-ui/react';
export const Route = createFileRoute('/_auth/dashboard')({
  component: DashboardPage,
});
import ky from 'ky';

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
