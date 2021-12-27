import { Event } from '#lib/interfaces/LightningBot';
import { Constants, Interaction } from 'discord.js';
const { Events } = Constants;

import { Poll } from '#src/models/index';

export default {
	name: Events.INTERACTION_CREATE,
	once: false,
	async execute(interaction: Interaction, client) {
		if (interaction.isCommand()) {
			const command = client.commands.get(interaction.commandName);
			if (!command) return;

			try {
				if (command.guildOnly && !(interaction.guild)) return interaction.reply({ content: 'This command is only available in guilds.', ephemeral: true });
				await command.execute(interaction, client);
			}
			catch (e) {
				console.error(e);
				return interaction.reply({ content: 'Sorry, something went wrong while using this command.' });
			}
		}
		else if (interaction.isButton()) {
			const poll = await Poll.findOne({ where: { message: interaction.message.id } });
			if (poll) {
				const button = poll.buttons.find(x => x == interaction.customId);
				const index = poll.buttons.indexOf(button);

				if (poll.votes[index].includes(interaction.user.id)) {
					poll.votes[index] = poll.votes[index].filter(id => id != interaction.user.id);
				}
				else if (poll.votes.flat().includes(interaction.user.id)) {
					poll.votes.forEach((_, vote) => poll.votes[vote] = poll.votes[vote].filter(id => id != interaction.user.id));
					poll.votes[index].push(interaction.user.id);
				}
				else {
					poll.votes[index].push(interaction.user.id);
				}

				await Poll.update(
					{ votes: poll.votes },
					{ where: { message: interaction.message.id } },
				);

				const footer = interaction.message.embeds[0].footer.text.split(' | ');
				for (const i in footer) {
					footer[i] = footer[i].replace(/(\d+)/g, (poll.votes[i].length).toString());
				}

				interaction.message.embeds[0].footer.text = footer.join(' | ');
				interaction.update({ embeds: [interaction.message.embeds[0]] });

				return;
			}
			return;
		}
		else { return; }
	},
} as Event<'interactionCreate'>;