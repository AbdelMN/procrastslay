import { Box, Spinner } from '@chakra-ui/react';
import Task from './Task';
import AddTask from './AddTask';
import { useQuery } from '@tanstack/react-query';
import { getTasksQuery } from '@/queries/task';

type TaskListProps = {
  id: string;
};

const TaskList = ({ id }: TaskListProps) => {
  const { data, isPending, isError } = useQuery(getTasksQuery(id));

  if (isPending || isError) return <Spinner />;

  return (
    <Box>
      <AddTask key={id} taskListId={id} />
      <Box width={'500px'}>
        {data.map((task) => {
          return <Task task={task} key={task.id} />;
        })}
      </Box>
    </Box>
  );
};

export default TaskList;
