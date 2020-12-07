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
	migrations: [process.env.TYPEORM_MIGRATIONS],
	entities: [process.env.TYPEORM_ENTITIES],
	cli: {
		migrationsDir: process.env.TYPEORM_MIGRATIONS_DIR,
		entitiesDir: process.env.TYPEORM_ENTITIES_DIR,
	},
};
