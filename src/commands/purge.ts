import type { Command } from '#interfaces/LightningBot';
import { TextChannel } from 'discord.js';

export default {
	name: 'purge',
	description: 'Purges a set amount of messages from 1 to 99.',
	options: [
		{
			name: 'amount',
			description: 'The amount of messages to delete.',
			type: 'NUMBER',
			required: true,
		},
	],
	guildOnly: true,
	async execute(interaction) {
		const number = interaction.options.getNumber('amount');

		if (number > 99) return interaction.reply('That\'s too big of a number!');
		if (number < 1) return interaction.reply('That\'s too small of a number!');

		await (interaction.channel as TextChannel).bulkDelete(number + 1);
		await interaction.reply(`Successfully purged **${number}** messages.`);
		await sleep(3000);
		await interaction.deleteReply();

	},
} as Command;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));