import { queryOptions } from '@tanstack/react-query';
import ky from 'ky';

type ReceivedTrainInfosType = {
  id: string;
  fuel: number;
  kilometer: number;
};

const fetchTrainInfos = async () =>
  (await ky('http://localhost:3000/train', {
    credentials: 'include',
  }).json()) as ReceivedTrainInfosType;

export const trainInfosQuery = queryOptions({
  queryKey: ['train'],
  queryFn: fetchTrainInfos,
});
