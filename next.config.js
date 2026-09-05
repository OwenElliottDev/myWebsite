/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  turbopack: {
    rules: {
      '*.md': {
        // Turbopack (dev + build default in Next 16) needs an absolute path;
        // a bare 'raw-loader' fails to resolve.
        loaders: [require.resolve('raw-loader')],
        as: '*.js',
      },
    },
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      use: require.resolve('raw-loader'),
    });
    return config;
  },
};

module.exports = nextConfig;
