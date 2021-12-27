import { Client, ClientOptions, Collection } from 'discord.js';
import { Command } from '#lib/interfaces/LightningBot';
import * as fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

export class LightningBot extends Client {
  private _commands: Collection<string, Command>;

  constructor(options: ClientOptions) {
    super(options);

    this._commands = new Collection();
    fs.readdir(join(dirname(fileURLToPath(import.meta.url)), '../commands'), async (err, files) => {
      if (err) return console.error(err);
      for (const file of files) {
        if (file.endsWith('.js')) {
          const command = (await import(`../commands/${file}`)).default;
          this._commands.set(command.name, command);
        }
      }
    });
  }

  public get commands() {
    return this._commands;
  }
}