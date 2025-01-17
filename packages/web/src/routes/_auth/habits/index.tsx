import { createFileRoute } from '@tanstack/react-router';
import HabitList from '@/components/habits/HabitList';
import { Box, Center } from '@chakra-ui/react';
import HabitDays from '@/components/habits/HabitDays';
type HabitSearch = {
  filter?: string;
};
export const Route = createFileRoute('/_auth/habits/')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): HabitSearch => {
    return { filter: search.filter as string };
  },
});

function RouteComponent() {
  return (
    <>
      <HabitDays />
      <Center>
        <Box>
          <HabitList />
        </Box>
      </Center>
    </>
  );
}
