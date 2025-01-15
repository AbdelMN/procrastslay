import { Box, VStack } from '@chakra-ui/react';
import Habit from './Habit';
import { Tag } from '../ui/tag';

const mockData = [
  {
    id: 'habit-1',
    userId: '1',
    name: 'Drink Water',
    frequencyType: 'daily',

    days: '["Monday", "Wednesday", "Friday"]',
    completionMode: 'oneTime',
    goalValue: 1,
    unit: 'cups',
    createdAt: '2025-01-01T08:00:00Z',
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
    createdAt: '2025-01-02T08:00:00Z',
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
    createdAt: '2025-01-03T08:00:00Z',
  },
];

const habitCompletions = [
  // Habit 1: Drink Water (one-time completion)
  {
    id: 'completion-1',
    habitId: 'habit-1',
    count: 1,
    date: new Date('2025-01-01T09:00:00Z'), // Completed on the first day
  },
  {
    id: 'completion-2',
    habitId: 'habit-1',
    count: 1,
    date: new Date('2025-01-03T09:00:00Z'), // Completed on Friday
  },

  // Habit 2: Workout (cumulative completion)
  {
    id: 'completion-3',
    habitId: 'habit-2',
    count: 1,
    date: new Date('2025-01-05T10:00:00Z'), // First workout of the week
  },
  {
    id: 'completion-4',
    habitId: 'habit-2',
    count: 2,
    date: new Date('2025-01-12T10:00:00Z'), // Second workout of the week
  },
  {
    id: 'completion-5',
    habitId: 'habit-2',
    count: 3,
    date: new Date('2025-01-19T10:00:00Z'), // Completed all three workouts
  },

  // Habit 3: Read a Book (cumulative completion)
  {
    id: 'completion-6',
    habitId: 'habit-3',
    count: 5,
    date: new Date('2025-01-06T11:00:00Z'), // 5 pages read
  },
  {
    id: 'completion-7',
    habitId: 'habit-3',
    count: 15,
    date: new Date('2025-01-09T11:00:00Z'), // 15 pages read (goal for interval)
  },
  {
    id: 'completion-8',
    habitId: 'habit-3',
    count: 20,
    date: new Date('2025-01-12T11:00:00Z'), // Completed the goal of 20 pages
  },
];

const HabitList = () => {
  const date = new Date('2025-01-01T09:00:00Z');

  const habits = habitCompletions
    .filter(
      (habitCompletion) => habitCompletion.date.getTime() === date.getTime(),
    )
    .map((habitCompletion) =>
      mockData.find(({ id }) => id === habitCompletion.habitId),
    );

  console.log(habits);
  return (
    <Box>
      <Tag closable> {date.toISOString()} </Tag>
      <VStack>{habits.map((habit) => habit && <Habit habit={habit} />)}</VStack>
    </Box>
  );
};

export default HabitList;
