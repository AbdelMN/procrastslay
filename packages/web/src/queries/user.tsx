import { queryOptions } from '@tanstack/react-query';
import ky from 'ky';

type UserInfosType = {
  fuel: number;
  streak: number;
};

const fetchUserInfos = async () =>
  ky('http://localhost:3000/user/infos', {
    credentials: 'include',
  }).json() as unknown as UserInfosType;

export const userInfosQuery = queryOptions({
  queryKey: ['userInfos'],
  queryFn: fetchUserInfos,
});
