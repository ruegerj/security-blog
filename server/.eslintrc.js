module.exports = {
	parser: '@typescript-eslint/parser', // Specifies the ESLint parser
	parserOptions: {
		ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
		sourceType: 'module', // Allows for the use of imports
	},
	extends: [
		'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
		'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
		'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
	],
	rules: {
		'prettier/prettier': 'error',
		'spaced-comment': 'off',
		'no-console': 'warn',
		'consistent-return': 'off',
		'func-names': 'off',
		'object-shorthand': 'off',
		'no-process-exit': 'off',
		'no-param-reassign': 'off',
		'no-return-await': 'off',
		'no-underscore-dangle': 'off',
		'class-methods-use-this': 'off',
		'prefer-destructuring': ['error', { object: true, array: false }],
		'no-unused-vars': ['error', { argsIgnorePattern: 'req|res|next|val' }],
	},
};
