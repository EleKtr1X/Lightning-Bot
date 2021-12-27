import { Event } from '#lib/interfaces/LightningBot';
import { Constants } from 'discord.js';
import { version } from '#constants/index';
import { Poll } from '#src/models/index';
const { Events } = Constants;

export default {
	name: Events.CLIENT_READY,
	once: true,
	execute(_, client) {
		Poll.sync({ force: true });

		console.log(`Ready! Logged in as ${client.user.tag}`);
		client.user.setActivity(`${client.guilds.cache.size} servers | v${version}`, { type: 'WATCHING' });
	},
} as Event<'ready'>;