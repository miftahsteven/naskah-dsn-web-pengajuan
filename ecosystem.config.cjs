module.exports = {
  apps: [
    {
      name: 'dsn-mui-public:3059',
      script: 'serve',
      env: {
        PM2_SERVE_PATH: './dist',
        PM2_SERVE_PORT: 3059,
        PM2_SERVE_SPA: 'true',
        PM2_SERVE_HOMEPAGE: '/index.html',
      },
      instances: 1,
      autorestart: true,
      max_memory_restart: '300M',
    },
  ],
};
