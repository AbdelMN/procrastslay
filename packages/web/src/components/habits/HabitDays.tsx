import { Heading, HStack, ProgressCircle, VStack } from '@chakra-ui/react';
import { ProgressCircleRing } from '../ui/progress-circle';
import { useMatchRoute, useNavigate } from '@tanstack/react-router';

const getLastDays = () => {
  const daysList = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);

    daysList.push(date.toISOString().split('T')[0]);
  }
  return daysList;
};

const last7Days = getLastDays();

const HabitDays = () => {
  const matchRoute = useMatchRoute();
  const navigate = useNavigate({ from: '/' });

  return (
    <HStack gap="2" justifyContent={'space-around'}>
      {last7Days.map((day) => {
        const styles = matchRoute({ to: '/habits', search: { filter: day } })
          ? { bgColor: 'gray.400' }
          : { bgColor: 'transparent', _hover: { bgColor: 'gray.800' } };

        return (
          <VStack
            key={day}
            {...styles}
            onClick={() => {
              navigate({ to: '/habits', search: { filter: day } });
            }}
            gap={0}
            borderRadius="5px"
            padding={'20px'}
          >
            <Heading size="md">
              {new Date(day).toLocaleDateString('en-EN', { weekday: 'long' })}
            </Heading>
            {day.split('-')[2]}
            <ProgressCircle.Root size={'xs'}>
              <ProgressCircleRing />
            </ProgressCircle.Root>
          </VStack>
        );
      })}
    </HStack>
  );
};

export default HabitDays;
