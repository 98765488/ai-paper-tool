/** @type {import('next').NextConfig} */
const nextConfig = {
  // Avoid watchpack scanning the whole F:\ drive on Windows
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: ['**/node_modules/**', '**/.git/**', '**/System Volume Information/**'],
      }
    }
    return config
  },
}

module.exports = nextConfig
