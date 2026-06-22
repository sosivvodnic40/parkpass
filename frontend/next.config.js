/** @type {import('next').NextConfig} */
const nextConfig = {
  // Dev uses .next; production build uses .next-build so build + dev never corrupt each other
  distDir: process.env.NEXT_BUILD === '1' ? '.next-build' : '.next',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'avatanplus.com' },
    ],
  },
};

module.exports = nextConfig;
