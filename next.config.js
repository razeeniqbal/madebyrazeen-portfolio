/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optional: build into another folder (e.g. when OneDrive or a dev server locks .next). Default .next.
  ...(process.env.NEXT_DIST_DIR && { distDir: process.env.NEXT_DIST_DIR }),
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

  // Old URLs → their current homes. V1 and its archive were removed (V2.0 Phase 1); their URLs land on Home.
  async redirects() {
    return [
      { source: '/achievements', destination: '/experience#credentials', permanent: true },
      // Lab was removed; its live coding activity moved to Experience.
      { source: '/lab', destination: '/experience#coding-activity', permanent: true },
      // Work became Projects; Notes became Stories, then Journal. Every old URL lands directly on the current one.
      { source: '/work', destination: '/projects', permanent: true },
      { source: '/work/:slug', destination: '/projects/:slug', permanent: true },
      { source: '/stories', destination: '/journal', permanent: true },
      { source: '/stories/:slug', destination: '/journal/:slug', permanent: true },
      { source: '/notes', destination: '/journal', permanent: true },
      { source: '/notes/:slug', destination: '/journal/:slug', permanent: true },
      { source: '/archive', destination: '/', permanent: true },
      { source: '/archive/:path*', destination: '/', permanent: true },
      { source: '/dashboard', destination: '/experience#coding-activity', permanent: true },
      { source: '/smart-talk', destination: '/experience#coding-activity', permanent: true },
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
