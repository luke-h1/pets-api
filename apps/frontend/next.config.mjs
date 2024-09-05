/** @type {import('next').NextConfig} */
const nextConfig = {
  reactProductionProfiling: true,
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
