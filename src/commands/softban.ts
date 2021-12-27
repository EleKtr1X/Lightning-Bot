import { GuildMember } from 'discord.js';
import type { Command } from '#interfaces/LightningBot';

export default {
  name: 'softban',
  description: 'Bans and then unbans a user, purging their messages and kicking them..',
  options: [
    {
      name: 'user',
      description: 'The user to softban',
      type: 'USER',
      required: true,
    },
    {
      name: 'reason',
      description: 'The reason for this softban',
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

    const member = interaction.options.getMember('user') as GuildMember;
    const reason = interaction.options.getString('reason') || 'None';

    let inServer = false;
    try {
      await interaction.guild.members.fetch(member.id);
      inServer = true;
    }
    catch {
      console.log('lol');
    }

    console.log(`\`\`\`${inServer}\`\`\``);

    if (!inServer) {
      return await interaction.editReply('That user is not in this server!');
    }

    if (typeof interaction.member?.permissions === 'string') {
      return await interaction.editReply('Member is not cached!');
    }

    if (!(interaction.guild?.me?.permissions.has('BAN_MEMBERS'))) {
      return await interaction.editReply('I do not have the **Ban Members** permission.');
    }
    if (!(interaction.member?.permissions.has('BAN_MEMBERS'))) {
      return await interaction.editReply('You do not have the **Ban Members** permission.');
    }

    await member.send(`You were banned from ${interaction.guild}.\n**Reason:** ${reason}`);
    await interaction.guild.bans.create(member.id, { days: interaction.options.getNumber('days') || 1, reason });
    await interaction.guild.members.unban(member.id, reason);

    await interaction.editReply({
      content: `Sucessfully softbanned **${member.user.tag}**.`,
      components: [],
    });
  },
} as Command;