import { Button, Card, HStack, Progress } from '@chakra-ui/react';

const mockGoal = {
  id: '703945a5-f3a4-427c-991f-a0cd1537be81',
  userId: '1',
  pomodoro: [{ duration: 25, goal: 3, completed: 2 }],
  habit: [{ goal: 6, completed: 6 }],
  task: [
    { difficulty: 'Easy', goal: 2, completed: 1 },
    { difficulty: 'Medium', goal: 4, completed: 2 },
  ],
  date: '2025-03-01T00:00:00.000Z',
  active: true,
};
const Goal = () => {
  const progressData = [
    ...mockGoal.task.map((task) => ({
      label: `${task.difficulty} task`,
      completed: task.completed,
      goal: task.goal,
    })),
    ...mockGoal.pomodoro.map((pomo) => ({
      label: 'Pomodoro',
      completed: pomo.completed,
      goal: pomo.goal,
    })),
    ...mockGoal.habit.map((habit) => ({
      label: 'Habit',
      completed: habit.completed,
      goal: habit.goal,
    })),
  ];

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
