module.exports = {
  apps: [
    {
      name: 'Lightning Bot',
      script: './dist/index.js',
      watch: true,
      ignore_watch: [/.+\.sqlite/],
      instances: '1',
    },
  ],
};