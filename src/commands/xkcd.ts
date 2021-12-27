import type { Command } from '#interfaces/LightningBot';
import { Comic } from '#lib/interfaces/XKCD';
import { MessageEmbed } from 'discord.js';
import { fetch } from 'undici';

export default {
	name: 'xkcd',
	description: 'A command that gives you an xkcd comic.',
	options: [
		{
			name: 'comic',
			description: 'The comic number',
			required: false,
			type: 'NUMBER',
		},
	],
	async execute(interaction) {
		const comicNum = interaction.options.getNumber('comic');

		if (comicNum) {
			const res = await fetch(`https://xkcd.com/${comicNum}/info.0.json`);
			const comic = await res.json().catch(() => interaction.reply('That comic does not exist!')) as Comic;

			const embed = new MessageEmbed()
				.setTitle(comic.title)
				.setURL(`https://xkcd.com/${comic.num}`)
				.setImage(comic.img)
				.setColor('#0099ff')
				.setFooter(comic.alt)
				.setAuthor(`XKCD #${comic.num}`);

			interaction.reply({ embeds: [embed] });
		}
		else {
			const tmpRes = await fetch('https://xkcd.com/info.0.json');
			const tmpComic = await tmpRes.json() as Comic;

			const randomComicNum = Math.ceil(Math.random() * tmpComic.num);
			const res = await fetch(`https://xkcd.com/${randomComicNum}/info.0.json`);
			const comic = await res.json() as Comic;

			const embed = new MessageEmbed()
				.setTitle(comic.title)
				.setURL(`https://xkcd.com/${comic.num}`)
				.setImage(comic.img)
				.setColor('#0099ff')
				.setFooter(comic.alt)
				.setAuthor(`XKCD #${comic.num}`);

			interaction.reply({ embeds: [embed] });
		}
	},
} as Command;