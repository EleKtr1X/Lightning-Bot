import type { Command } from '#interfaces/LightningBot';
import { GuildChannel, GuildMember, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { nanoid } from 'nanoid';
import { emojis } from '#constants/index';

export default {
	name: 'rps',
	description: 'Starts a game of rock-paper-scissors!',
	options: [
		{
			name: 'opponent',
			description: 'Your... opponent',
			type: 'USER',
			required: true,
		},
	],
	guildOnly: true,
	async execute(interaction) {
		const author = interaction.user;
		const opponent = interaction.options.getUser('opponent');

		try {
			const member = (interaction.options.getMember('opponent') as GuildMember).user;
			if (interaction.channel.isText() && !((interaction.channel as GuildChannel).permissionsFor(member).has('VIEW_CHANNEL'))) {
				return await interaction.reply('That user does not have the permissions to view this channel!');
			}
		}
		catch (e) {
			console.error(e);
			return await interaction.reply('You cannot play rock-paper-scissors with a user that is not in this server!');
		}

		if (opponent.id == author.id) {
			return await interaction.reply('You cannot play rock-paper-scissors with yourself!');
		}
		else if (opponent.bot) {
			return await interaction.reply('You cannot play rock-paper-scissors with a bot!');
		}
		const baseEmbed = new MessageEmbed().setColor('#0099ff');
		const rpsEmbed = baseEmbed
			.setTitle('Rock, paper, scissors!')
			.setDescription(`**${author.tag}** has challenged **${opponent.tag}** to a rock-paper-scissors battle! Click the buttons to make your move!\n`);

		const rockId = nanoid();
		const paperId = nanoid();
		const scissorsId = nanoid();

		const rock = new MessageButton()
			.setCustomId(rockId)
			.setEmoji(emojis.rock)
			.setStyle('PRIMARY');
		const paper = new MessageButton()
			.setCustomId(paperId)
			.setEmoji(emojis.paper)
			.setStyle('PRIMARY');
		const scissors = new MessageButton()
			.setCustomId(scissorsId)
			.setEmoji(emojis.scissors)
			.setStyle('PRIMARY');

		const buttons = new MessageActionRow()
			.addComponents([ rock, paper, scissors ]);

		await interaction.reply({ embeds: [rpsEmbed], components: [buttons] });

		const collector = interaction.channel.createMessageComponentCollector({
			filter: collected => collected.user.id === author.id ||
					collected.user.id === opponent.id,
			componentType: 'BUTTON',
			time: 60000,
			max: 2,
		});

		let authorResp = '';
		let opponentResp = '';

		collector.on('collect', async i => {
			if ((authorResp && i.user.id == author.id)
				|| (opponentResp && i.user.id == opponent.id)) {
				await interaction.followUp({ content: 'You already chose your move!', ephemeral: true });
				return;
			}

			const name = i.customId == rockId
				? 'rock'
				: (i.customId == paperId
					? 'paper'
					: (i.customId == scissorsId
						? 'scissors'
						: ''));

			if (i.user.id == author.id) {
				authorResp = name;
				rpsEmbed.description += `\n**${author.tag}** chose their move!`;
				i.followUp({ content: `You chose ${authorResp}!`, ephemeral: true });
			}
			else if (i.user.id == opponent.id) {
				opponentResp = name;
				rpsEmbed.description += `\n**${opponent.tag}** chose their move!`;
				i.followUp({ content: `You chose ${opponentResp}!`, ephemeral: true });
			}

			if (authorResp && opponentResp) {
				collector.stop();
				rock.setDisabled(true).setStyle('SECONDARY');
				paper.setDisabled(true).setStyle('SECONDARY');
				scissors.setDisabled(true).setStyle('SECONDARY');

				const disabledButtons = new MessageActionRow()
					.addComponents([ rock, paper, scissors ]);

				i.update({ embeds: [rpsEmbed], components: [disabledButtons] });
				return;
			}

			i.update({ embeds: [rpsEmbed], components: [buttons] });
		});

		collector.on('end', async () => {
			if (authorResp && opponentResp) {
				rpsEmbed.setDescription(`**${author.tag}** chose ${authorResp}! ${emojis[authorResp]}\n**${opponent.tag}** chose ${opponentResp}! ${emojis[opponentResp]}\n\n${calcWinner([authorResp, author.tag], [opponentResp, opponent.tag])}`);
			}
			else {
				rpsEmbed.description += '\n\nLooks like the timer ran out, and someone was too slow to respond.';
			}
		});
	},
} as Command;

function calcWinner(author, opponent) {
	const array = ['scissors', 'rock', 'paper'];
	const x = array.indexOf(author[0]) + 1;
	const y = array.indexOf(opponent[0]) + 1;

	const r = x - y;
	if (r == 0) return 'There was a tie!';
	else if (r == 1 || r == -2) return `**${author[1]}** wins!`;
	else return `**${opponent[1]}** wins!`;
}