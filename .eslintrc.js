module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2018,
		project: './tsconfig.json',
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true,
		},
	},
	plugins: ['@typescript-eslint'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
	],
	rules: {
	},
	settings: {
		propWrapperFunctions: [
			// The names of any function used to wrap propTypes,
			// e.g. `forbidExtraProps`. If this isn't set, any propTypes
			// wrapped in a function will be skipped.
			'forbidExtraProps',
			{ property: 'freeze', object: 'Object' },
		],
	},
};
