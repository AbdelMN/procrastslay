import { prisma } from '../prisma';

export const addUserFuel = async (userId: string, amount: number) => {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      fuel: { increment: amount },
    },
  });
};
