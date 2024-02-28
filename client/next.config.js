/** @type {import('next').NextConfig} */
const nextConfig = {}

// next.config.js
module.exports = {
  experimental: {
    // Enable modern ES6 import/export support
    topLevelAwait: true,
  },
  images: {
    domains: [
      'localhost',
      "tasktrove-server.vercel.app",
      "tasktrove-xi.vercel.app",
      'lh3.googleusercontent.com',
      "firebasestorage.googleapis.com"],
  },
};