import type { Command } from '#interfaces/LightningBot';

export default {
	name: 'ping',
	description: 'Pong!',
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
} as Command;