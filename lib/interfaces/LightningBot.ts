import { LightningBot } from '#src/structures/LightningBot';
import { CommandInteraction, ClientEvents, ApplicationCommandOptionType, ApplicationCommandOptionChoice } from 'discord.js';

export interface Event<T extends keyof ClientEvents = keyof ClientEvents> {
	name: T;
	once: boolean;
	// eslint-disable-next-line no-unused-vars
	execute: (...args: [...ClientEvents[T], LightningBot]) => Promise<any>;
}

export interface Command {
	name: string,
	description: string,
	options?: Option[];
	guildOnly: boolean;
	// eslint-disable-next-line no-unused-vars
	execute: (interaction: CommandInteraction, client?: LightningBot) => unknown;
}

export interface Option {
	name: string;
	description: string;
	options: Option[];
	type: ApplicationCommandOptionType;
	required: boolean;
	min_value: number;
	max_value: number;
	choices: ApplicationCommandOptionChoice[];
	autocomplete: boolean;
}