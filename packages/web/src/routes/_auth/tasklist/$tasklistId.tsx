import {
  createFileRoute,
  Link,
  Outlet,
  useLocation,
} from '@tanstack/react-router';
import { Box, Center, Spinner } from '@chakra-ui/react';
import { getTasksQuery } from '@/queries/task';
import { useQuery } from '@tanstack/react-query';
import Task from '@/components/tasks/Task';
export const Route = createFileRoute('/_auth/tasklist/$tasklistId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { tasklistId } = Route.useParams();
  const { data, isPending, isError } = useQuery(getTasksQuery(tasklistId));
  const location = useLocation();
  if (isPending || isError) return <Spinner />;
  return (
    <Center>
      <Box>
        <Box width={'500px'}>
          {data.map((task) => (
            <Task task={task} key={task.id} />
          ))}
        </Box>
        {!(location.pathname === `/tasklist/${tasklistId}/task/new`) ? (
          <Link to={`/tasklist/${tasklistId}/task/new`}>+ Add task</Link>
        ) : (
          ''
        )}
        <Outlet />
      </Box>
    </Center>
  );
}
