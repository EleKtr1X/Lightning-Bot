import { Sequelize } from 'sequelize';
import { PollFactory } from '#models/poll';

export const pollDbConfig = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: 'dist/src/databases/poll.sqlite',
});

export const Poll = PollFactory(pollDbConfig);