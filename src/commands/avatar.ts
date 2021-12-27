import type { AllowedImageSize } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import type { Command } from '#interfaces/LightningBot';

export default {
	name: 'avatar',
	description: 'Gets the avatar of the user specified.',
	options: [
		{
			name: 'user',
			type: 'USER',
			description: 'The user to get the avatar of',
			required: false,
		},
		{
			name: 'size',
			type: 'INTEGER',
			description: 'The size of the user\'s avatar',
			required: false,
			choices: [
				{ name: '16px × 16px', value: 16 },
				{ name: '32px × 32px', value: 32 },
				{ name: '64px × 64px', value: 64 },
				{ name: '128px × 128px', value: 128 },
				{ name: '256px × 256px', value: 256 },
				{ name: '512px × 512px ― default', value: 512 },
				{ name: '1024px × 1024px', value: 1024 },
				{ name: '2048px × 2048px', value: 2048 },
				{ name: '4096px × 4096px', value: 4096 },
			],
		},
	],
	async execute(interaction) {
		const user = interaction.options.getUser('user') || interaction.user;
		const avatar = user.displayAvatarURL({
			dynamic: true,
			format: 'png',
			size: interaction.options.getNumber('size') as AllowedImageSize || 512,
		});
		const avatarEmbed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle(`Avatar of ${user.tag}`)
			.setImage(avatar)
			.setDescription(`[PNG](${user.displayAvatarURL({ format: 'png' })}) | [WEBP](${user.displayAvatarURL({ format: 'webp' })}) | [JPEG](${user.displayAvatarURL({ format: 'jpeg' })})${avatar.includes('.gif') ? ` | [GIF](${avatar})` : ''}`);
		await interaction.reply({ embeds: [avatarEmbed], ephemeral: (interaction.options.getBoolean('hide') || false) });
	},
} as Command;