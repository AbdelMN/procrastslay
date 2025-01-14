import { createFileRoute } from '@tanstack/react-router';
import HabitList from '@/components/habits/HabitList';
export const Route = createFileRoute('/_auth/habits/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <HabitList />;
}
