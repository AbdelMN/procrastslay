import TaskList from '@/components/tasks/TaskList';
import { createFileRoute } from '@tanstack/react-router';
import { Center } from '@chakra-ui/react';
export const Route = createFileRoute('/_auth/tasklist/$tasklistId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { tasklistId } = Route.useParams();
  return (
    <Center>
      <TaskList id={+tasklistId} />
    </Center>
  );
}
