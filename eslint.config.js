// @ts-check
const angular = require('angular-eslint');
const tsParser = require('@typescript-eslint/parser');

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

    // Extract inline component templates so the template rules below see them
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: tsParser,
        },
        processor: angular.processInlineTemplates,
    },

    // Angular HTML templates (external .html files and extracted inline templates)
    ...angular.configs.templateRecommended.map((config) => ({
        ...config,
        files: ['**/*.html'],
    })),
    {
        files: ['**/*.html'],
        rules: {
            // Guard against reintroducing *ngIf/*ngFor/*ngSwitch (#268)
            '@angular-eslint/template/prefer-control-flow': 'error',
        },
    },

    // Vendored PrimeNG fork mirrors upstream sources; don't force `===` there
    {
        files: ['projects/helix/**/*.html'],
        rules: {
            '@angular-eslint/template/eqeqeq': 'off',
        },
    },
];
