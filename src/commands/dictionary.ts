import { config } from 'dotenv';
config();

import { MessageEmbed, MessageButton, MessageActionRow } from 'discord.js';
import { nanoid } from 'nanoid';
import { fetch } from 'undici';
import { emojis } from '#constants/index';
import type { MainEntry, Result } from '#interfaces/Oxford';
import type { Command } from '#interfaces/LightningBot';

export default {
	name: 'dictionary',
	description: 'Gets an entry from the Oxford Dictionary.',
	options: [
		{
			name: 'word',
			description: 'The word to get an entry on',
			type: 'STRING',
			required: true,
		},
	],
	async execute(interaction) {
		await interaction.deferReply();
		const word = interaction.options.getString('word');

		const res = await fetch(`https://od-api.oxforddictionaries.com/api/v2/entries/en-gb/${word}`, {
			headers: {
				Accept: 'application/json',
				app_id: process.env.APP_ID,
				app_key: process.env.APP_KEY,
			},
		});

		if (res.status === 200) {
			const data = await res.json() as MainEntry;

			const dictionaryEmbed = new MessageEmbed()
				.setTitle(`**${decodeURIComponent(word as string)}**`)
				.setDescription(getDefStr(data.results[0] as Result))
				.setColor('#0099ff');

			if (data.results.length > 1) {
				const exponents = ['¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
				dictionaryEmbed.title += exponents[0];
				dictionaryEmbed.title += data.results[0].lexicalEntries[0].entries[0].pronunciations
					? ` \`/${data.results[0].lexicalEntries[0].entries[0].pronunciations[0].phoneticSpelling}/\``
					: '';

				dictionaryEmbed.setFooter(`Page 1/${data.results.length}`);

				const firstId = nanoid();
				const prevId = nanoid();
				const nextId = nanoid();
				const lastId = nanoid();

				const firstButton = new MessageButton()
					.setCustomId(firstId)
					.setEmoji(emojis.doubleLeft)
					.setStyle('PRIMARY')
					.setDisabled(true);
				const prevButton = new MessageButton()
					.setCustomId(prevId)
					.setEmoji(emojis.left)
					.setStyle('PRIMARY')
					.setDisabled(true);
				const nextButton = new MessageButton()
					.setCustomId(nextId)
					.setEmoji(emojis.right)
					.setStyle('PRIMARY');
				const lastButton = new MessageButton()
					.setCustomId(lastId)
					.setEmoji(emojis.doubleRight)
					.setStyle('PRIMARY');

				const buttonRow = new MessageActionRow()
					.addComponents([firstButton, prevButton, nextButton, lastButton]);


				await interaction.editReply({
					embeds: [dictionaryEmbed],
					components: [buttonRow],
				});

				const collector = interaction.channel.createMessageComponentCollector({
					filter: async collected => {
						const m = await interaction.fetchReply();
						return collected.user.id === interaction.user.id && collected.isMessageComponent() && collected.message.id === m.id;
					},
					time: 180000,
				});

				let page = 0;

				collector.on('collect', async i => {
					if (!i.isMessageComponent()) return;
					if (i.customId === firstId)		{ page = 0; }
					else if (i.customId === prevId) { page -= 1; }
					else if (i.customId === nextId) { page += 1; }
					else if (i.customId === lastId) { page = data.results.length - 1; }

					dictionaryEmbed.setTitle(`**${decodeURIComponent(word as string)}**`);
					dictionaryEmbed.title += exponents[page];
					dictionaryEmbed.title += data.results[page].lexicalEntries[0].entries[0].pronunciations ? ` \`${data.results[page].lexicalEntries[0].entries[0].pronunciations[0].phoneticSpelling}\`` : '';
					dictionaryEmbed.description = getDefStr(data.results[page]);
					dictionaryEmbed.setFooter(`Page ${page + 1}/${data.results.length}`);

					firstButton.setDisabled(page == 0);
					prevButton.setDisabled(page == 0);

					lastButton.setDisabled(page == data.results.length - 1);
					nextButton.setDisabled(page == data.results.length - 1);

					const tmpButtonRow = new MessageActionRow()
						.addComponents([firstButton, prevButton, nextButton, lastButton]);

					await i.update({ embeds: [dictionaryEmbed], components: [tmpButtonRow] });
				});

				collector.on('end', async () => {
					firstButton.setDisabled(true).setStyle('SECONDARY');
					prevButton.setDisabled(true).setStyle('SECONDARY');
					lastButton.setDisabled(true).setStyle('SECONDARY');
					nextButton.setDisabled(true).setStyle('SECONDARY');

					const tmpButtonRow = new MessageActionRow()
						.addComponents([firstButton, prevButton, nextButton, lastButton]);

					await interaction.editReply({ embeds: [dictionaryEmbed], components: [tmpButtonRow] });
				});
			}
			else {
				dictionaryEmbed.title += ` \`/${data.results[0].lexicalEntries[0].entries[0].pronunciations[0].phoneticSpelling}/\``;
				await interaction.editReply({ embeds: [dictionaryEmbed] });
			}
		}
		else if (res.status === 404) {
			await interaction.editReply(`"${word}" does not exist in the English Oxford Dictionary!`);
		}
		else {
			await interaction.editReply(`Error!\nCode: ${res.status}\nText: ${res.statusText}`);
		}
	},
} as Command;

function getDefStr(results: Result) {
	const entries: Record<string, string[]> = {};
	for (const i of results.lexicalEntries) {
		for (const j of i.entries[0].senses) {
			if (!(i.lexicalCategory.id in entries)) {
				Object.assign(entries, { [i.lexicalCategory.id]: [j.definitions[0]] });
			}
			else {
				entries[i.lexicalCategory.id].push(j.definitions[0]);
			}
		}
	}

	let entryStr = '';
	for (const [key, value] of Object.entries(entries)) {
		entryStr += `**${key.toUpperCase()}**`;
		for (const i in value) {
			const start = +i === 0 ? '\n```ini\n' : '';
			const end = !value[+i + 1] ? '```\n' : '';

			entryStr += `${start}[${+i + 1}] ${(value as string[])[i].replaceAll(';', ',')}\n${end}`;
		}
	}

	if (results.lexicalEntries[0].entries[0].etymologies) {
		entryStr += `**Origin:** ${results.lexicalEntries[0].entries[0].etymologies}`;
	}

	return entryStr;
}
