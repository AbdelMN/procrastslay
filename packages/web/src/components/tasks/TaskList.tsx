import { Box, Flex, Table } from '@chakra-ui/react';
import Task from './Task';
import AddTask from './AddTask';
import { useQuery } from '@tanstack/react-query';
import ky from 'ky';
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

const fetchTasks = async (tasklistId) => {
  const response = await ky(
    `http://localhost:3000/tasklist/${tasklistId}/tasks`,
    {
      credentials: 'include',
    },
  );

  return response.json();
};
const TaskList = ({ id }: TaskListProps) => {
  const { data } = useQuery({
    queryKey: ['tasks', id],
    queryFn: () => fetchTasks(id),
    enabled: true,
    retry: false,
  });

  return (
    <Box>
      <AddTask key={id} taskListId={id} />
      <Box width={'500px'}>
        {data &&
          data.map((task) => {
            return <Task task={task} key={task.id} />;
          })}
      </Box>
    </Box>
  );
};

export default TaskList;
