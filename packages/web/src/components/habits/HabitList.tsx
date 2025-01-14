import { Box, Card, Heading, ProgressCircleRoot } from '@chakra-ui/react';
import { Checkbox } from '@/components/ui/checkbox';
import { ProgressCircleRing } from '../ui/progress-circle';
const mockData = [
  {
    id: 'habit-1',
    userId: '1',
    name: 'Drink Water',
    frequencyType: 'daily',
    frequencyValue: null,
    days: '["Monday", "Wednesday", "Friday"]',
    completionMode: 'oneTime',
    goalValue: null,
    unit: 'cups',
    createdAt: '2025-01-01T08:00:00Z',
  },
  {
    id: 'habit-2',
    userId: '1',
    name: 'Workout',
    frequencyType: 'weekly',
    frequencyValue: 3,
    days: null,
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
    days: null,
    completionMode: 'cumulative',
    goalValue: 20,
    unit: 'pages',
    createdAt: '2025-01-03T08:00:00Z',
  },
];

const HabitList = () => {
  return (
    <>
      {mockData.map((habit) => {
        const isCumulative = habit.completionMode == 'cumulative';
        return (
          <Card.Root size="sm">
            <Card.Header>
              <Heading size="md"> {habit.name} </Heading>
            </Card.Header>
            <Card.Body color="fg.muted">
              {isCumulative ? (
                <ProgressCircleRoot size={'xs'} value={100}>
                  <ProgressCircleRing />
                </ProgressCircleRoot>
              ) : (
                <Checkbox />
              )}
            </Card.Body>
          </Card.Root>
        );
      })}
    </>
  );
};
export default HabitList;
