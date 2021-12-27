import type { Command } from '#interfaces/LightningBot';
import { GuildMember, MessageEmbed } from 'discord.js';

export default {
	name: 'userinfo',
	description: 'Gets information on a user.',
	options: [
		{
			name: 'user',
			type: 'USER',
			description: 'The user to get info on',
			required: false,
		},
	],
	async execute(interaction) {
		const user = interaction.options.getUser('user') || interaction.user;

		const userEmbed = new MessageEmbed()
			.setColor('#0099ff')
			.setAuthor(user.tag, user.displayAvatarURL())
			.addField('User Information', `\u2022 **Username:** ${user.username}\n\u2022 **Discriminator:** ${user.discriminator}\n\u2022 **ID:** ${user.id}\n\u2022 **Account Created:** <t:${Math.floor(user.createdTimestamp / 1000)}:R>`);

		if (interaction.guild) {
			const member = (interaction.options.getMember('user') || interaction.member) as GuildMember;
			const roleArray = member.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());

			userEmbed
				.addField('Member Information', `\u2022 **Joined Server:** <t:${Math.floor(member.joinedTimestamp / 1000)}:R>\n\u2022 **Nickname:** ${member.nickname || 'None'}\n\u2022 **Permissions:** [${member.permissions.bitfield}](https://discordapi.com/permissions.html#${member.permissions.bitfield})\n`)
				.addField('Roles', roleArray.length > 10 ? roleArray.slice(0, 10).join(', ') + `, and ${roleArray.length - 10} more.` : roleArray.join(' '));
		}
		await interaction.reply({ embeds: [userEmbed] });
	},
} as Command;