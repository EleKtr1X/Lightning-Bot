import { config } from 'dotenv';
config();
import fs from 'fs/promises';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import type { Command } from '#lib/interfaces/LightningBot';

const optionType = {
	SUB_COMMAND: 1,
	SUB_COMMAND_GROUP: 2,
	STRING: 3,
	INTEGER: 4,
	BOOLEAN: 5,
	USER: 6,
	CHANNEL: 7,
	ROLE: 8,
	MENTIONABLE: 9,
	NUMBER: 10,
};

const commands = [];
const commandFiles = (await fs.readdir('./dist/src/commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command: Command = (await import(`../src/commands/${file}`)).default;
	const commandObject = { name: command.name, description: command.description, options: [], type: 1 };

	if (command.options) {
		parseOps(command.options, commandObject);
	}

	commands.push(commandObject);
}

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN as string);

(async () => {
	try {
		await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID as string, process.env.GUILD_ID as string), { body: commands });
		console.log('\nSuccessfully registered application commands.');
	}
	catch (error) {
		console.log();
		console.error(error);
	}
})();

function parseOps(options, commandObject) {
	for (const i of options) {
		if (!commandObject.options) commandObject.options = [];
		commandObject.options.push({
			type: optionType[i.type],
			name: i.name,
			description: i.description,
			autocomplete: i.autocomplete,
			options: i.options ? parseOps(i.options, commandObject.options) : undefined,
			required: i.required,
			choices: i.choices,
			min_value: i.min_value,
			max_value: i.max_value,
		});
	}
}