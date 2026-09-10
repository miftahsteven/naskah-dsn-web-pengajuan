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
      // Mode cluster: 'max' akan mendistribusikan traffic ke seluruh core CPU server secara seimbang
      // Atau tentukan angka tetap (misal: 2)
      instances: process.env.PM2_INSTANCES || 'max',
      exec_mode: 'cluster',
      autorestart: true,
      max_memory_restart: '300M',
    },
  ],
};
