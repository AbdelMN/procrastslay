import { createFileRoute } from '@tanstack/react-router';
import HabitList from '@/components/habits/HabitList';
import { Box, Center } from '@chakra-ui/react';
export const Route = createFileRoute('/_auth/habits/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Center>
      <Box width={'500px'}>
        <HabitList />
      </Box>
    </Center>
  );
}
