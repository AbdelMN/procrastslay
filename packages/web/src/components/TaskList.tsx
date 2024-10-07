import { Box } from '@chakra-ui/react';
import TaskItem from './TaskItem';
const TaskList = ({ tasks, onToggleComplete, onDelete }) => {
  return (
    <Box>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
        />
      ))}
    </Box>
  );
};

export default TaskList;
