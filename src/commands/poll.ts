import type { Command } from '#interfaces/LightningBot';
import { Poll } from '#src/models/index';
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { emojis } from '#constants/index';
import { nanoid } from 'nanoid';

export default {
  name: 'poll',
  description: 'Creates a poll!',
  options: [
    {
      name: 'question',
      description: 'The question to ask',
      required: true,
      type: 'STRING',
    },
    {
      name: 'options',
      description: 'Options for a multiple-choice poll instead of a yes/no one, separated by the pipe symbol (|)',
      required: false,
      type: 'STRING',
    },
  ],
  guildOnly: true,
  async execute(interaction) {
    const embed = new MessageEmbed()
      .setColor('#0099ff')
      .setAuthor({ name: `${interaction.user.tag} asks:`, iconURL: interaction.user.avatarURL() })
      .setTitle(`“${interaction.options.getString('question')}”`);

    const optionsInput = interaction.options.getString('options');

    if (optionsInput) {
      const options = optionsInput.split(/ ?\| ?/);
      if (options.length > 5) {
        return interaction.reply({ content: 'You cannot have more than 5 options!', ephemeral: true });
      }
      const idArray = [];
      const votesArray = [];
      const buttonArray = [];
      const footerArray = [];

      const textArray = ['A', 'B', 'C', 'D', 'E'];

      for (const i in options) {
        idArray.push(nanoid());

        const tmpButton = new MessageButton()
          .setCustomId(idArray[i])
          .setStyle('PRIMARY')
          .setEmoji(emojis[textArray[i]])
        // eslint-disable-next-line no-irregular-whitespace
          .setLabel(`​   ${options[i]}`);

        // embed.description += `Click ${textArray[i]} for \`${options[i]}\`\n`;

        footerArray.push(`Option ${textArray[i]}: 0`);
        buttonArray.push(tmpButton);
        votesArray.push([]);
      }

      embed.setFooter(footerArray.join('  |  '));

      const buttons = new MessageActionRow()
        .addComponents(buttonArray);

      const message = await interaction.reply({ embeds: [embed], components: [buttons], fetchReply: true });

      await Poll.create({
        message: message.id,
        buttons: idArray,
        votes: votesArray,
      });
    }
    else {
      embed.setFooter('Yes: 0  |  No: 0');

      const yesId = nanoid();
      const noId = nanoid();

      const yesButton = new MessageButton()
        .setCustomId(yesId)
        .setEmoji(emojis.check)
        .setStyle('SUCCESS');

      const noButton = new MessageButton()
        .setCustomId(noId)
        .setEmoji(emojis.times)
        .setStyle('DANGER');

      const ynButtons = new MessageActionRow()
        .addComponents([yesButton, noButton]);

      const message = await interaction.reply({ embeds: [embed], components: [ynButtons], fetchReply: true });

      await Poll.create({
        message: message.id,
        buttons: [yesId, noId],
        votes: [[], []],
      });
    }
  },
} as Command;