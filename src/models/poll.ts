import { Snowflake } from 'discord.js';
import tmp from 'sequelize';
import type { Model, BuildOptions, Sequelize } from 'sequelize';
const { DataTypes } = tmp;

interface PollAttributes {
	message: Snowflake;
	buttons: string[];
	votes: Snowflake[][];
}

interface PollModel extends Model<PollAttributes>, PollAttributes {}

type PollStatic = typeof Model & {
	// eslint-disable-next-line no-unused-vars
	new (values?: object, options?: BuildOptions): PollModel;
}

export function PollFactory(sequelize: Sequelize): PollStatic {
	return <PollStatic>sequelize.define('poll', {
		message: {
			type: DataTypes.STRING,
			unique: true,
		},
		buttons: DataTypes.JSON,
		votes: DataTypes.JSON,
	});
}