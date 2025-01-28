import { Box, HStack, Spinner, VStack } from '@chakra-ui/react';
import Habit from './Habit';
import { Tag } from '@chakra-ui/react';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { CloseButton } from '../ui/close-button';
import { useQuery } from '@tanstack/react-query';
import { getHabits } from '@/queries/habit';
import AddHabit from './AddHabit';

const route = getRouteApi('/_auth/habits/');
const HabitList = () => {
  const { filter } = route.useSearch();
  const navigate = useNavigate({ from: '/' });

  const { data, isPending, isError } = useQuery(getHabits(filter));
  if (isPending || isError) return <Spinner />;
  console.log(data);
  if (filter) {
    const date = new Date(filter);

    return (
      <Box>
        <HStack justifyContent={'space-between'}>
          <Tag.Root>
            <Tag.Label>{date.toISOString()}</Tag.Label>

            <CloseButton
              onClick={() =>
                navigate({
                  to: '/habits',
                })
              }
              size={'xs'}
            />
          </Tag.Root>
          <AddHabit />
        </HStack>
        <VStack>
          {data.map((habit) => (
            <Habit key={habit.id} habit={habit} date={date} />
          ))}
        </VStack>
      </Box>
    );
  }
  return (
    <Box>
      <VStack>
        {data.map((habit) => (
          <Habit key={habit.id} habit={habit} />
        ))}
      </VStack>
    </Box>
  );
};

export default HabitList;
