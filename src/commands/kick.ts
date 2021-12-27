import type { GuildMember } from 'discord.js';
import type { Command } from '#interfaces/LightningBot';

export default {
  name: 'kick',
  description: 'Kicks a member from the server.',
  options: [
    {
      name: 'member',
      description: 'The member to kick',
      type: 'USER',
      required: true,
    },
    {
      name: 'reason',
      description: 'The reason the member will be kicked',
      type: 'STRING',
      required: false,
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
    const member = interaction.options.getMember('member') as GuildMember;
    if (member.id == (interaction.member as GuildMember).id) {
      return interaction.reply({
        content: 'You can\'t kick yourself!',
        ephemeral: true,
      });
    }

    const reason = interaction.options.getString('reason') || 'None';

    member.send(`You were kicked from ${interaction.guild.name}.\n**Reason**: ${reason}`);
    member.kick(reason).then((memb) => {
      interaction.reply({
        content: `Successfully kicked **${memb.user.tag}**.`,
        ephemeral: interaction.options.getBoolean('hide') || false,
      });
    }).catch(() => {
      interaction.reply({ content: 'Something seems to be broken.', ephemeral: true });
    });
  },
} as Command;