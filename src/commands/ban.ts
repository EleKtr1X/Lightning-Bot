import { MessageButton, MessageActionRow } from 'discord.js';
import type { User } from 'discord.js';
import { nanoid } from 'nanoid';
import type { Command } from '#interfaces/LightningBot';

export default {
  name: 'ban',
  description: 'Bans a user.',
  options: [
    {
      name: 'user',
      description: 'The user to ban',
      type: 'USER',
      required: true,
    },
    {
      name: 'reason',
      description: 'The reason for this ban',
      type: 'STRING',
      required: false,
    },
    {
      name: 'days',
      description: 'The number of days to purge',
      type: 'INTEGER',
      required: false,
      choices: [
        { name: 'None', value: 0 },
        { name: 'One day ― default', value: 1 },
        { name: 'Two days', value: 2 },
        { name: 'Three days', value: 3 },
        { name: 'Four days', value: 4 },
        { name: 'Five days', value: 5 },
        { name: 'Six days', value: 6 },
        { name: 'Seven days', value: 7 },
      ],
    },
    {
      name: 'hide',
      description: 'Whether to hide the response',
      type: 'BOOLEAN',
      required: false,
    },
  ],
  guildOnly: true,
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: (interaction.options.getBoolean('hide') || false) });

    const user = interaction.options.getUser('user') as User;

    let alreadyBanned = false;
    try {
      await interaction.guild.bans.fetch(user.id);
      alreadyBanned = true;
    }
    catch {
      // pretend something very important is here as to distract eslint
    }

    if (alreadyBanned) {
      await interaction.editReply({
        content: 'That user has already been banned!',
      });
    }

    const reason = interaction.options.getString('reason') || 'None';

    if (!(interaction.guild.me.permissions.has('BAN_MEMBERS'))) {
      return await interaction.editReply({
        content: 'I do not have the **Ban Members** permission.',
      });
    }

    if (typeof interaction.member.permissions === 'string') {
      return await interaction.editReply('Member is not cached!');
    }

    if (!(interaction.member.permissions.has('BAN_MEMBERS'))) {
      return await interaction.editReply({
        content: 'You do not have the **Ban Members** permission.',
      });
    }

    const banId = nanoid();
    const cancelId = nanoid();

    const banButton = new MessageButton()
      .setCustomId(banId)
      .setLabel('Ban')
      .setStyle('DANGER');
    const cancelButton = new MessageButton()
      .setCustomId(cancelId)
      .setLabel('Cancel')
      .setStyle('SECONDARY');

    await interaction.editReply({
      content: `Are you sure you want me to ban **${user.tag}**?`,
      components: [
        new MessageActionRow()
          .addComponents([cancelButton, banButton]),
      ],
    });

    const collectedInteraction = await interaction.channel.awaitMessageComponent({
      filter: collected => collected.user.id === interaction.user.id,
      componentType: 'BUTTON',
      time: 15000,
    }).catch(async () => {
      await interaction.editReply({
        content: 'Timer ran out.',
        components: [],
      });
    });

    if (!collectedInteraction) return;

    if (collectedInteraction.customId === cancelId) {
      await collectedInteraction.update({
        content: 'Cancelled ban.',
        components: [],
      });
    }
    else if (collectedInteraction.customId === banId) {
      await collectedInteraction.deferUpdate();

      await user.send(`You were banned from ${interaction.guild}.\n**Reason:** ${reason}`);
      await interaction.guild.bans.create(user.id, { days: interaction.options.getNumber('days') || 1, reason });

      await collectedInteraction.editReply({
        content: `Sucessfully banned **${user.tag}**.`,
        components: [],
      });
    }
  },
} as Command;
