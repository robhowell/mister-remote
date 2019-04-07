const config = {
  apiPort: 3030,
  rootFolder: '/media/fat',
  sshHost: {
    host: '192.168.1.133',
    username: 'root',
    password: '1'
  }
};

config.megaDriveRomFolder = `${config.rootFolder}/Genesis`;
config.bootRomFolder = `${config.rootFolder}/bootrom`;

module.exports = config;
