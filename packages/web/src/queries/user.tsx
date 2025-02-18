import { queryOptions } from '@tanstack/react-query';
import ky from 'ky';

const fetchUserInfos = async () =>
  ky('http://localhost:3000/user/infos', { credentials: 'include' }).json();

export const userInfosQuery = queryOptions({
  queryKey: ['userInfos'],
  queryFn: fetchUserInfos,
});
