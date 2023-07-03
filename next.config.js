/** @type {import('next').NextConfig} */
module.exports = {
  eslint: {
    // Disabling on production builds because we're running checks on PRs via GitHub Actions.
    ignoreDuringBuilds: true
  },
  experimental: {
    serverActions: true
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/s/files/**'
      }
    ]
  }
  // reactStrictMode: true,
  // webpack: (config) => {
  //   config.resolve = {
  //     ...config.resolve,
  //     fallback: {
  //       fs: false
  //     }
  //   };
  //   return config;
  // }
  // webpack5: true,
  // webpack: (config) => {
  //   config.resolve.fallback = { fs: false, os: false, https: false, http: false };

  //   return config;
  // }
};
