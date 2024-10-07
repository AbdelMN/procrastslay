import { Box, Button, Text } from '@chakra-ui/react';
const TaskItem = ({ task, onToggleComplete, onDelete }) => {
  return (
    <Box
      border="1px solid"
      borderColor="gray.200"
      p={4}
      rounded="lg"
      _hover={{
        bg: 'gray.100',
      }}
    >
      <Text fontWeight="bold">{task.title}</Text>
      <Text>{task.description}</Text>
      <Button
        onClick={() => onToggleComplete(task.id)}
        colorScheme={task.completed ? 'green' : 'gray'}
      >
        {task.completed ? 'Mark as incomplete' : 'Mark as complete'}
      </Button>
      <Button onClick={() => onDelete(task.id)}>Delete</Button>
    </Box>
  );
};

export default TaskItem;
