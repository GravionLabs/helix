// @ts-check
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const angular = require('@angular-eslint/eslint-plugin');
const angularTemplate = require('@angular-eslint/eslint-plugin-template');
const templateParser = require('@angular-eslint/template-parser');
const prettierConfig = require('eslint-config-prettier');

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

    // TypeScript – shared base
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: ['./tsconfig.json', './projects/*/tsconfig*.json'],
                tsconfigRootDir: __dirname,
            },
        },
        plugins: {
            '@typescript-eslint': tseslint,
            '@angular-eslint': angular,
        },
        rules: {
            ...tseslint.configs['recommended'].rules,
            ...angular.configs.recommended.rules,
            '@angular-eslint/component-class-suffix': 'off',
            '@angular-eslint/directive-class-suffix': 'off',
            '@angular-eslint/no-empty-lifecycle-method': 'warn',
            // prefer-inject is a good practice but downgraded to warn for legacy compatibility
            '@angular-eslint/prefer-inject': 'warn',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            // @ts-ignore should be @ts-expect-error but downgraded for legacy code
            '@typescript-eslint/ban-ts-comment': 'warn',
            ...prettierConfig.rules,
        },
    },

    // TypeScript – library: enforce gv- prefix (element or attribute)
    {
        files: ['projects/sakai-ui/**/*.ts'],
        rules: {
            '@angular-eslint/component-selector': [
                'error',
                { type: ['element', 'attribute'], prefix: 'gv', style: 'kebab-case' },
            ],
            '@angular-eslint/directive-selector': [
                'error',
                { type: 'attribute', prefix: 'gv', style: 'camelCase' },
            ],
        },
    },

    // TypeScript – demo: allow app- prefix
    {
        files: ['projects/demo/**/*.ts'],
        rules: {
            '@angular-eslint/component-selector': [
                'warn',
                { type: ['element', 'attribute'], prefix: ['app', 'gv'], style: 'kebab-case' },
            ],
            '@angular-eslint/directive-selector': [
                'warn',
                { type: 'attribute', prefix: ['app', 'gv'], style: 'camelCase' },
            ],
        },
    },

    // Library spec files: enforce relative imports (never barrel alias)
    {
        files: ['projects/sakai-ui/**/*.spec.ts'],
        rules: {
            'no-restricted-imports': [
                'warn',
                {
                    paths: [
                        {
                            name: '@gravion/sakai-ui',
                            message:
                                'Use relative imports in library specs instead of the public barrel.',
                        },
                    ],
                },
            ],
        },
    },

    // Angular HTML templates
    {
        files: ['**/*.html'],
        languageOptions: {
            parser: templateParser,
        },
        plugins: {
            '@angular-eslint/template': angularTemplate,
        },
        rules: {
            ...angularTemplate.configs.recommended.rules,
        },
    },
];
