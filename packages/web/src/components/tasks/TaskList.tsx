import { Box, Flex, Table } from '@chakra-ui/react';
import Task from './Task';
import AddTask from './AddTask';
type TaskListProps = {
  id: number;
};
const tasks = [
  { id: 1, title: 'test', completed: true },
  { id: 2, title: 'test', completed: true },
  { id: 3, title: 'non', completed: true },
  { id: 4, title: 'oui', completed: true },
  { id: 5, title: 'lol', completed: true },
];
const TaskList = ({ id }: TaskListProps) => {
  return (
    <Box>
      <AddTask taskListId={id} />
      <Box width={'500px'}>
        {tasks.map((task) => {
          return <Task task={task} />;
        })}
      </Box>
    </Box>
  );
};

export default TaskList;
