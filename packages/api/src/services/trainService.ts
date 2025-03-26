import { table } from 'console';
import { prisma } from '../prisma';

export const addTrainFuel = async (userId: string, amount: number) => {
  return await prisma.train.update({
    where: { userId },
    data: { fuel: { increment: amount } },
  });
};

export const updateTrainProgress = async (trainId: string) => {
  const train = await prisma.train.findUnique({ where: { id: trainId } });

  if (!train) throw new Error('Train not found');

  const lastUpdate = train.lastUpdate;
};
