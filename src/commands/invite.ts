import { MessageEmbed } from 'discord.js';
import type { Command } from '#interfaces/LightningBot';

export default {
  name: 'invite',
  description: 'Sends the support server\'s link and my invite link!',
  async execute(interaction) {
    const embed = new MessageEmbed()
      .setColor('#0099ff')
      .addField('\u2799 Add Me!', '[Click Here](https://discord.com/oauth2/authorize?client_id=589803927885578261&scope=bot)')
      .addField('\u2799 Join my support server!', '[Click Here](https://discord.gg/dqV3ypQ)')
      .setThumbnail(this.client.user.displayAvatarURL());

    await interaction.reply({ embeds: [embed] });
  },
} as Command;