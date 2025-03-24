import { prisma } from '../prisma';

export const addTrainFuel = async (userId: string, amount: number) => {
  return await prisma.train.update({
    where: { userId },
    data: { fuel: { increment: amount } },
  });
};


export const 