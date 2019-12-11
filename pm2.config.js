module.exports = {
  apps: [{
    name: 'yet-another-mtg-database',
    script: './YAMDBService/server/index.js',
    instances: 1,
    autorestart: true,
    max_memory_restart: '512M'
  }]
};
