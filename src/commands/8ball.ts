import type { Command } from '#interfaces/LightningBot';

const wait = (await import('util')).promisify(setTimeout);

export default {
  name: '8ball',
  description: 'Asks the magical 8-ball a question.',
  options: [
    {
      name: 'question',
      description: 'The question to ask the 8-ball',
      type: 'STRING',
      required: true,
    },
  ],
  async execute(interaction) {
    const answerArr = ['Yes.', 'No.', 'Maybe.', 'Definitely not.', 'It is certain.', 'Can\'t talk now.'];
    const ans = Math.floor(Math.random() * 6);

    await interaction.reply(':8ball: Shaking the ball...');
    await wait(2000);
    await interaction.editReply(`:8ball: ${answerArr[ans]}`);
  },
} as Command;