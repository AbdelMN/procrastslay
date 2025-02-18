import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import { Box, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import Sidebar from '@/components/sidebar/Sidebar';
import { FaBars, FaBolt, FaGasPump } from 'react-icons/fa6';
import UserInfos from '@/components/user/UserInfos';
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
  // const router = useRouter();
  // const navigate = Route.useNavigate();
  // const auth = useAuth();

  // const handleLogout = () => {
  //   if (window.confirm('Are you sure you want to logout?')) {
  //     auth.logout().then(() => {
  //       router.invalidate().finally(() => {
  //         navigate({ to: '/' });
  //       });
  //     });
  //   }
  // };

  return (
    <>
      <Flex>
        <Sidebar />
        <Box bgColor={'gray.950'} width={'100%'}>
          <HStack
            justifyContent={'space-between'}
            h={'5vh'}
            bg="gray.900"
            width={'100%'}
            pl={'10'}
            pr={'10'}
          >
            <FaBars size={20} />
            <UserInfos />
          </HStack>

          <Outlet />
        </Box>
      </Flex>
    </>
  );
}
