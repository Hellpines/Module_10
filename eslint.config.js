import next from 'eslint-config-next';
import prettier from 'eslint-config-prettier';

export default [
    ...next,

    prettier,

    {
        files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
        rules: {
            curly: ['warn', 'multi-line', 'consistent'],
            '@typescript-eslint/no-non-null-assertion': 'off',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
            'no-console': ['warn', { allow: ['warn', 'error', 'log'] }],

            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
            'react/display-name': 'off',

            '@next/next/no-img-element': 'off',
            '@next/next/no-html-link-for-pages': 'off',

            'no-duplicate-imports': 'off',
        },
    },

    {
        files: ['src/views/Sign/**/*.tsx'],
        rules: {
            'react-hooks/incompatible-library': 'off',
        },
    },

    {
        files: [
            '**/*.test.ts',
            '**/*.test.tsx',
            '**/*.spec.ts',
            '**/*.spec.tsx',
            'tests/**/*.ts',
            'tests/**/*.tsx',
            '**/__tests__/**/*.ts',
            '**/__tests__/**/*.tsx',
        ],
        rules: {
            'react-hooks/rules-of-hooks': 'off',
            '@typescript-eslint/no-non-null-assertion': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            'no-console': 'off',
            curly: 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            'testing-library/prefer-screen-queries': 'off',
            'testing-library/prefer-presence-queries': 'off',
            'testing-library/no-node-access': 'off',
            'testing-library/no-container': 'off',
            'testing-library/no-wait-for-multiple-assertions': 'off',
        },
    },

    {
        files: ['tests/**/*', '**/*.spec.ts', '**/*.spec.tsx'],
        rules: {
            'no-undef': 'off',
        },
    },

    {
        ignores: [
            '.next/**',
            'node_modules/**',
            'out/**',
            'dist/**',
            'build/**',
            'coverage/**',
            '*.config.js',
            '*.config.ts',
            '.eslintrc.*',
            'next-env.d.ts',
            '**/*.d.ts',
            'public/**',
            'tests/**/*.d.ts',
        ],
    },
];
