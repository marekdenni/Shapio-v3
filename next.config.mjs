/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // POZOR: Tohle dovolí buildu proběhnout, i když máš v kódu chyby
    ignoreBuildErrors: true,
  },
  eslint: {
    // Tohle vypne kontrolu pravidel psaní kódu během buildu
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;