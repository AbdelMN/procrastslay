import { userInfosQuery } from '@/queries/user';
import { HStack, Spinner } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { FaBolt, FaGasPump } from 'react-icons/fa6';

const UserInfos = () => {
  const { data, isPending, isError } = useQuery(userInfosQuery);

  if (isPending || isError) return <Spinner />;

  return (
    <HStack>
      <HStack>
        <FaGasPump /> : {data.fuel}
      </HStack>
      <HStack>
        <FaBolt /> : {data.streak}
      </HStack>
    </HStack>
  );
};

export default UserInfos;
