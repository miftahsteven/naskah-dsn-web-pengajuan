const path = require('path');

module.exports = {
  apps: [
    {
      name: 'dsn-mui-public:3059',
      script: 'serve',
      env: {
        PM2_SERVE_PATH: path.resolve(__dirname, 'dist'),
        PM2_SERVE_PORT: 3059,
        PM2_SERVE_SPA: 'true',
        PM2_SERVE_HOMEPAGE: '/index.html',
      },
      // pm2 serve static files wajib menggunakan fork mode (1 instance)
      // agar tidak terjadi port collision / deadlock
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '300M',
    },
  ],
};
