import { Box, VStack } from '@chakra-ui/react';
import Habit, { HabitType } from './Habit';
import { Tag } from '../ui/tag';
import { getRouteApi } from '@tanstack/react-router';

const mockData: HabitType[] = [
  {
    id: 'habit-1',
    userId: '1',
    name: 'Drink Water',
    frequencyType: 'daily',

    days: ['Monday', 'Wednesday', 'Friday'],
    completionMode: 'oneTime',
    goalValue: 1,
    unit: 'cups',
    createdAt: '2025-01-01',
  },
  {
    id: 'habit-2',
    userId: '1',
    name: 'Workout',
    frequencyType: 'weekly',
    frequencyValue: 3,

    completionMode: 'cumulative',
    goalValue: 3,
    unit: 'seances',
    createdAt: '2025-01-02',
  },
  {
    id: 'habit-3',
    userId: '1',
    name: 'Read a Book',
    frequencyType: 'interval',
    frequencyValue: 3,

    completionMode: 'cumulative',
    goalValue: 20,
    unit: 'pages',
    createdAt: '2025-01-03',
  },
];

const isHabitinDate = (habit: HabitType, date: Date) => {
  switch (habit.frequencyType) {
    case 'interval': {
      const diffInTime = date.getTime() - new Date(habit.createdAt).getTime();

      const diffInDays = diffInTime / (1000 * 3600 * 24);

      return diffInDays >= 0 && diffInDays % habit.frequencyValue === 0;
    }

    case 'daily': {
      const localDate = date.toLocaleDateString('en-EN', { weekday: 'long' });

      return habit.days.includes(localDate);
    }
    case 'weekly':
      return true;
    default:
      throw new Error('Impossible habit on invalid FrequencyType');
  }
};
const route = getRouteApi('/_auth/habits/');
const HabitList = () => {
  const { filter } = route.useSearch();
  const [day, month, year] = filter.split('-');
  const date = new Date(`${year}-${month}-${day}`);
  const habitByDate = mockData.filter((habit) => isHabitinDate(habit, date));

  return (
    <Box>
      <Tag closable> {date.toISOString()} </Tag>
      <VStack>
        {habitByDate.map((habit) => habit && <Habit habit={habit} />)}
      </VStack>
    </Box>
  );
};

export default HabitList;
