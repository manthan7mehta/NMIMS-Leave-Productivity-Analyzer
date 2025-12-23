/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep Prisma external to avoid bundling native bits; bundle xlsx to avoid symlink creation on Windows
  serverExternalPackages: ['@prisma/client']
}

module.exports = nextConfig