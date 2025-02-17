import { createMiddleware } from 'hono/factory';
import gameConfig from './gameConfig.json';
const rewardsMiddleware = createMiddleware<{
  Variables: {
    rewards: {
      pomodoro: number;
      habit: number;
      task: { easy: number; medium: number; hard: number };
    };
  };
}>(async (c, next) => {
  c.set('rewards', gameConfig.rewards);
  await next();
});

export default rewardsMiddleware;
