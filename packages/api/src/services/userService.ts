import { prisma } from '../prisma';

export const addUserFuel = async (
  userId: string,
  amount: number,
  date?: Date,
  type?: string,
) => {
  if (type === 'habit' && date) {
    const isCompletionToday =
      new Date(date).toISOString().split('T')[0] ===
      new Date().toISOString().split('T')[0];

    if (!isCompletionToday) {
      return;
    }
  }

  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      fuel: { increment: amount },
    },
  });
};

const removeUserFuel = async (
  userId: string,
  amount: number,
  completedAt: Date,
) => {
  const isCompletionToday =
    new Date(completedAt).toISOString().split('T')[0] ===
    new Date().toISOString().split('T')[0];

  if (isCompletionToday) {
    return await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        fuel: { decrement: amount },
      },
    });
  }
};

export const addOrRemoveUserFuel = async (
  completion: Boolean,
  userId: string,
  amount: number,
  completedAt?: Date,
  type?: string,
) => {
  if (!completion && completedAt)
    return removeUserFuel(userId, amount, completedAt);
  return await addUserFuel(userId, amount, completedAt, type);
};
