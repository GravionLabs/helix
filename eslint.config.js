// @ts-check
const angular = require('angular-eslint');

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
    {
        ignores: [
            'dist/**',
            'node_modules/**',
            '.angular/**',
            'coverage/**',
            '**/*.js',
            '**/*.mjs',
            '**/*.cjs',
        ],
    },

    // Angular HTML templates only
    ...angular.configs.templateRecommended.map((config) => ({
        ...config,
        files: ['**/*.html'],
    })),
];
