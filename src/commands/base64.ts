import { MessageEmbed } from 'discord.js';
import type { Command } from '#interfaces/LightningBot';

export default {
  name: 'base64',
  description: 'Encodes/decodes text into/from Base64.',
  options: [
    {
      type: 'SUB_COMMAND',
      name: 'encode',
      description: 'Encodes text into Base64',
      options: [
        {
          name: 'text',
          description: 'The text to encode into Base64',
          type: 'STRING',
          required: true,
        },
      ],
    },
    {
      type: 'SUB_COMMAND',
      name: 'decode',
      description: 'Decodes text from Base64',
      options: [
        {
          name: 'text',
          description: 'The text to decode from Base64',
          type: 'STRING',
          required: true,
        },
      ],
    },
  ],
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const input = interaction.options.getString('text');

    const baseEmbed = new MessageEmbed()
      .setColor('#0099ff');

    if (subcommand === 'encode') {
      const encodedBuf = Buffer.from(input as string);
      await interaction.reply({
        embeds: [
          baseEmbed
            .setTitle('Encoding into Base64')
            .setDescription(`**Input**: \`${input}\`\n**Output**: \`${encodedBuf.toString('base64')}\``),
        ],
      });
    }
    else if (subcommand === 'decode') {
      await interaction.reply({
        embeds: [
          baseEmbed
            .setTitle('Encoding into Base64')
            .setDescription(`**Input**: \`${input}\`\n**Output**: \`${Buffer.from(input as string, 'base64')}\``),
        ],
      });
    }
  },
} as Command;