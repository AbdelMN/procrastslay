import { Box, Button, Heading, Text } from '@chakra-ui/react';
import { useState } from 'react';
import TaskList from './TaskList';

const Dashboard = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Task 1',
      description: 'This is a task description',
      completed: false,
    },
    {
      id: 2,
      title: 'Task 2',
      description: 'This is another task description',
      completed: true,
    },
    {
      id: 3,
      title: 'Task 3',
      description: 'This is a third task description',
      completed: false,
    },
  ]);

  const onToggleComplete = (id) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const onDelete = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  };

  return (
    <Box>
      <Heading>Dashboard</Heading>
      <Text>Welcome to your dashboard!</Text>
      <Button>Add a task</Button>
      <TaskList
        tasks={tasks}
        onToggleComplete={onToggleComplete}
        onDelete={onDelete}
      />
    </Box>
  );
};

export default Dashboard;
