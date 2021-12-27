import { Event } from '#lib/interfaces/LightningBot';
import { Constants } from 'discord.js';
import { version } from '#constants/index';

const { Events } = Constants;

export default {
	name: Events.GUILD_DELETE,
	once: true,
	async execute(_, client) {
		client.user.setActivity(`${client.guilds.cache.size} servers | v${version}`, { type: 'WATCHING' });
	},
} as Event<'guildDelete'>;