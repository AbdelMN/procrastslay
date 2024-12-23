import {
  Link,
  Outlet,
  createFileRoute,
  redirect,
  useRouter,
} from '@tanstack/react-router';

import { useAuth } from '../auth';
import { Flex } from '@chakra-ui/react';
import Sidebar from '../components/sidebar/sidebar';

export const Route = createFileRoute('/_auth')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isLoggedIn) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: AuthLayout,
});

function AuthLayout() {
  const router = useRouter();
  const navigate = Route.useNavigate();
  const auth = useAuth();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      auth.logout().then(() => {
        router.invalidate().finally(() => {
          navigate({ to: '/' });
        });
      });
    }
  };

  return (
    <Flex>
      <Sidebar />
      <Outlet />
    </Flex>
  );
}
