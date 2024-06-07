/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: ["@mapgl-shadows/ui"],
  output: 'export',
  basePath: '/lighting-control',
  assetPrefix: '/lighting-control',
  distDir: '../../docs',
  cleanDistDir: true,
};
