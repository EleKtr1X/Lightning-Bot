import { LightningBot } from '#src/structures/LightningBot';
import { CommandInteraction, ClientEvents, ApplicationCommandOption } from 'discord.js';

export interface Event<T extends keyof ClientEvents = keyof ClientEvents> {
	name: T;
	once: boolean;
	// eslint-disable-next-line no-unused-vars
	execute: (...args: [...ClientEvents[T], LightningBot]) => Promise<any>;
}

export interface Command {
	name: string,
	description: string,
	options?: ApplicationCommandOption[];
	guildOnly: boolean;
	// eslint-disable-next-line no-unused-vars
	execute: (interaction: CommandInteraction, client?: LightningBot) => unknown;
}