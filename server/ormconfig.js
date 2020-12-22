// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv-with-expand');
dotenv.config({
	path: 'config.dev.env',
});

module.exports = {
	type: process.env.TYPEORM_CONNECTION,
	database: process.env.TYPEORM_DATABASE,
	logging: process.env.TYPEORM_LOGGING,
	synchronize: process.env.TYPEORM_SYNCHRONIZE,
	migrations: ['src/data-access/migrations/*ts'], // Use explictit ts migrations
	migrationsTableName: process.env.TYPEORM_MIGRATIONS_TABLE_NAME,
	entities: ['src/data-access/entities/*ts'], // Use explictit ts entities
	cli: {
		// Use explicit ts folders
		migrationsDir: ['src/data-access/migrations'],
		entitiesDir: ['src/data-access/entities'],
	},
};
