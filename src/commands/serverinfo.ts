import type { Command } from '#interfaces/LightningBot';
import { MessageEmbed } from 'discord.js';

export default {
	name: 'serverinfo',
	description: 'Gets information on the current server.',
	async execute(interaction) {
		const guild = interaction.guild;
		const owner = await guild.fetchOwner();

		const serverEmbed = new MessageEmbed()
			.setAuthor(guild.name, guild.iconURL())
			.setColor('#0099ff')
			.setDescription(guild.description || '')
			.addField('General Information', `\u2022 **Name:** ${guild.name}\n\u2022 **ID:** ${guild.id}\n\u2022 **Created:** <t:${Math.floor(guild.createdTimestamp / 1000)}:R>\n\u2022 **Roles:** ${guild.roles.cache.size}\n\u2022 **Emojis:** ${guild.emojis.cache.size}\n\u2022 **Boosts:** ${guild.premiumSubscriptionCount} (${guild.premiumTier == 'NONE' ? 'No tier' : toSentenceCase(guild.premiumTier).replace('_', ' ')})\n[\u2022 **Icon**](${guild.iconURL()})\n`)
			.addField('Members', `\u2022 **Total Members:** ${guild.memberCount}\n\u2022 **Server Owner:** ${owner.user.tag}`);

		await interaction.reply({ embeds: [serverEmbed] });
	},
} as Command;

function toSentenceCase(string: String) {
	return string[0].toUpperCase() + string.slice(1).toLowerCase();
}