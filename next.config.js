/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
})

module.exports = withPWA({
  eslint: {
    dirs: ['app', 'component', 'features', 'pages'],
  },

  // Because we use static pages, we need to disable image optimization.
  // https://stackoverflow.com/questions/65487914/error-image-optimization-using-next-js-default-loader-is-not-compatible-with-n
  images: {
    unoptimized: true,
  },
})
