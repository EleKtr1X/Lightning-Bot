import type { Command } from '#interfaces/LightningBot';
import { MessageEmbed, version } from 'discord.js';
import ts from 'typescript';

export default {
  name: 'stats',
  description: 'Bot stats and general information.',
  async execute(interaction) {
    const statsEmbed = new MessageEmbed()
      .setTitle(`${interaction.client.user.username} Statistics`)
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .addField('Code Stats', `\u2022 [discord.js](https://discord.js.org) v${version}\n\u2022 [node.js](https://nodejs.org) ${process.version}\n\u2022 [TypeScript](https://typescriptlang.org) v${ts.version}`)
      .addField('Started Running', `<t:${Math.floor((new Date).getTime() / 1000) - interaction.client.uptime}:R>`)
      .addField('Memory Usage', `${Math.floor(process.memoryUsage().heapUsed / 1000000)}MB / ${Math.floor(process.memoryUsage().heapTotal / 1000000)}MB`)
      .addField('General Statistics', `**Guilds:** ${interaction.client.guilds.cache.size}\n**Channels:** ${interaction.client.channels.cache.size}`)
      .setColor('#0099ff');

    interaction.reply({ embeds: [statsEmbed] });
  },
} as Command;