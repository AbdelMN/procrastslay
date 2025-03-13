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

const removeUserFuel = async (userId: string, amount: number) => {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      fuel: { decrement: amount },
    },
  });
};

export const addOrRemoveUserFuel = async (
  completion: Boolean,
  userId: string,
  amount: number,
  completedAt?: Date,
  type?: string,
) => {
  if (!completion) {
    if (completedAt) {
      const isCompletionToday =
        new Date(completedAt).toISOString().split('T')[0] ===
        new Date().toISOString().split('T')[0];

      if (isCompletionToday) return removeUserFuel(userId, amount);
    }
    return await addUserFuel(userId, amount, completedAt, type);
  }
  if (!completion) {
    return removeUserFuel(userId, amount);
  }
};

export const getUserFuel = async (userId: string) => {
  const result = await prisma.user.findFirst({
    where: { id: userId },
    select: { fuel: true },
  });
  if (result) {
    return result.fuel;
  }
  return 0;
};

export const addStreak = async (userId: string) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { streak: { increment: 1 } },
  });
};

export const resetStreak = async (userId: string) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { streak: 0 },
  });
};
