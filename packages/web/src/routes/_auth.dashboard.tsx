import { createFileRoute } from '@tanstack/react-router';
import TaskList from '../components/tasks/tasklist';
import { useAuth } from '../auth';
import { useQuery } from '@tanstack/react-query';
export const Route = createFileRoute('/_auth/dashboard')({
  component: DashboardPage,
});
import ky from 'ky';

const fetchSession = async () => {
  const response = await ky('http://localhost:3000/notion/tasklist', {
    credentials: 'include',
  });

  return response.json();
};

function DashboardPage() {
  const auth = useAuth();
  if (!auth.user) {
    return <p> Vous n'êtes pas connecté </p>;
  }
  const { data, isError, isLoading, error } = useQuery({
    queryKey: ['ssa'],
    queryFn: fetchSession,
  });
  if (isLoading) {
    console.log('Chargement en cours...');
    return <div>Chargement...</div>;
  }

  if (isError) {
    console.error('Erreur de chargement des données :', error);
    return <div>Erreur : Impossible de récupérer les données</div>;
  }
  console.log(data);
  return <TaskList tasklist={data} />;
}
