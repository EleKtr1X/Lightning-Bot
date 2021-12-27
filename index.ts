import { config } from 'dotenv';
config();

import { Intents } from 'discord.js';
import { LightningBot } from '#structures/LightningBot';
import { Event } from '#lib/interfaces/LightningBot';
import * as fs from 'fs/promises';

const client = new LightningBot({ intents: [Intents.FLAGS.GUILDS], allowedMentions: { parse: ['everyone', 'roles', 'users'] } });
const eventFiles = (await fs.readdir('./dist/src/events')).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
  if (file.endsWith('.js')) {
    const event: Event = (await import(`./src/events/${file}`)).default;
    if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
    else client.on(event.name, (...args) => event.execute(...args, client));
  }
}

client.login(process.env.TOKEN);
