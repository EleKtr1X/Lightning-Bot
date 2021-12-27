import type { Command } from '#interfaces/LightningBot';

export default {
  name: 'roll',
  description: 'Rolls a die!',
  options: [
    {
      name: 'sides',
      description: 'How many sides the dice should have (must be between 2 and 20, default is 6)',
      type: 'NUMBER',
      min_value: 2,
      max_value: 20,
      required: false,
    },
  ],
  async execute(interaction) {
    const sides = interaction.options.getNumber('sides') || 6;
    const roll = Math.ceil(Math.random() * sides);
    if (sides == 2) {
      interaction.reply(`You flipped **${roll == 1 ? 'heads' : 'tails'}**. :coin:`);
    }
    else {
      interaction.reply(`You rolled a **${roll}**. :game_die:`);
    }
  },
} as Command;