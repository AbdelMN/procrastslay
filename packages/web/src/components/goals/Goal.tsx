import { getCurrentGoal } from '@/queries/goal';
import { Button, Card, HStack, Progress, Spinner } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';

const Goal = () => {
  const { data, isPending, isError } = useQuery(getCurrentGoal());

  if (isPending || isError) return <Spinner />;
  console.log(data[0]);
  const progressData = [
    ...data[0].task.map((task) => ({
      label: `${task.difficulty} task`,
      completed: task.completed,
      goal: task.goal,
    })),
    ...data[0].pomodoro.map((pomo) => ({
      label: `${pomo.duration} min pomodoro`,
      completed: pomo.completed,
      goal: pomo.goal,
    })),
    ...data[0].habit.map((habit) => ({
      label: 'Habit',
      completed: habit.completed,
      goal: habit.goal,
    })),
  ];

  console.log(progressData);
  return (
    <Card.Root width="320px">
      <Card.Body gap="2">
        <Card.Title mt="2">03/03/2025 - Goal</Card.Title>
        <Card.Description>Status : Active</Card.Description>
        {progressData.map((item, index) => {
          const progress = (item.completed / item.goal) * 100;
          return (
            <Progress.Root key={index} value={progress} maxW="sm">
              <HStack gap="5">
                <Progress.Label>{item.label}</Progress.Label>
                <Progress.Track flex="1">
                  <Progress.Range />
                </Progress.Track>
                <Progress.ValueText>
                  {item.completed} / {item.goal}
                </Progress.ValueText>
              </HStack>
            </Progress.Root>
          );
        })}
      </Card.Body>
      <Card.Footer justifyContent="flex-end">
        <Button variant="outline">Cancel goal</Button>
        <Button>Complete day</Button>
      </Card.Footer>
    </Card.Root>
  );
};

export default Goal;
