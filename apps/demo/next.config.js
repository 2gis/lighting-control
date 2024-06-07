/* eslint-env node -- config */

/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: ["@mapgl-shadows/ui"],
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/lighting-control' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/lighting-control' : '',
  distDir: '../../docs',
  cleanDistDir: true,
};
