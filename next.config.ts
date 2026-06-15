import type { NextConfig } from 'next';

const svgrLoaderOptions = {
    exportType: 'named',
    namedExport: 'ReactComponent',
};

const isGithubPages = process.env.GITHUB_PAGES === 'true';
const repoBasePath = '/Module_10';

const nextConfig: NextConfig = {
    reactStrictMode: true,

    experimental: {
        optimizePackageImports: ['@mui/material', '@mui/icons-material', 'recharts'],
    },

    ...(isGithubPages
        ? {
              output: 'export',
              basePath: repoBasePath,
              assetPrefix: `${repoBasePath}/`,
              trailingSlash: true,
              images: { unoptimized: true },
          }
        : {}),

    compiler: {
        styledComponents: true,
    },

    turbopack: {
        rules: {
            '*.svg': {
                loaders: [
                    {
                        loader: '@svgr/webpack',
                        options: svgrLoaderOptions,
                    },
                ],
                as: '*.js',
            },
        },
    },

    webpack(config) {
        const fileLoaderRule = config.module.rules.find((rule: { test?: RegExp }) =>
            rule.test?.test?.('.svg')
        );

        config.module.rules.push(
            {
                ...fileLoaderRule,
                test: /\.svg$/i,
                resourceQuery: /url/,
            },
            {
                test: /\.svg$/i,
                issuer: fileLoaderRule.issuer,
                resourceQuery: { not: [/url/] },
                use: [
                    {
                        loader: '@svgr/webpack',
                        options: svgrLoaderOptions,
                    },
                ],
            }
        );

        fileLoaderRule.exclude = /\.svg$/i;

        return config;
    },
};

export default nextConfig;
