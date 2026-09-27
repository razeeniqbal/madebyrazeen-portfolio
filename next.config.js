/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize for lower memory usage
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  turbopack: {},

  // Suppress hydration warnings from browser extensions
  reactStrictMode: true,

  // Image optimization
  images: {
    remotePatterns: [
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    qualities: [75, 85],
  },

  // The chat API builds its knowledge from content/data at runtime; make sure those files ship with it.
  outputFileTracingIncludes: {
    '/api/chat': ['./content/data/**/*'],
  },

  // V1 URLs → their V2 homes. V1 itself lives on at /archive/v1.
  async redirects() {
    return [
      { source: '/projects', destination: '/work', permanent: true },
      { source: '/achievements', destination: '/work#credentials', permanent: true },
      // Notes became Stories (refinement spec §27).
      { source: '/notes', destination: '/stories', permanent: true },
      { source: '/notes/:slug', destination: '/stories/:slug', permanent: true },
      { source: '/dashboard', destination: '/lab', permanent: true },
      { source: '/smart-talk', destination: '/lab', permanent: true },
    ];
  },

  // Compress output
  compress: true,

  // Production optimizations
  poweredByHeader: false,

  // Webpack configuration for memory optimization
  webpack: (config, { isServer, dev }) => {
    // Reduce memory usage during development
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            commons: {
              name: 'commons',
              chunks: 'all',
              minChunks: 2,
            },
            framerMotion: {
              name: 'framer-motion',
              test: /[\\/]node_modules[\\/](framer-motion)[\\/]/,
              priority: 10,
              reuseExistingChunk: true,
            },
          },
        },
        runtimeChunk: !dev ? 'single' : false,
      };
    }

    return config;
  },
};

module.exports = nextConfig;
