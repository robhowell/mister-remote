const SSH2Promise = require('ssh2-promise');
const api = require('./api');
const { setSsh } = require('./remoteFiles');
const { apiPort } = require('./config');

const ssh = new SSH2Promise({
  host: '192.168.1.134',
  username: 'root',
  password: '1'
});

const main = async () => {
  await ssh.connect();
  setSsh(ssh);
  console.log('Connected to MiSTer');
  api.start(apiPort);
  console.log(`Started API on port ${apiPort}`);
};

main();
