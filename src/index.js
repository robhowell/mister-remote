const SSH2Promise = require('ssh2-promise');
const { setSsh, getAllFilenames } = require('./remoteFiles');

const ssh = new SSH2Promise({
  host: '192.168.1.134',
  username: 'root',
  password: '1'
});

const romFolder = '/media/fat';
const megaDriveRomFolder = `${romFolder}/Genesis`;

const main = async () => {
  await ssh.connect();
  setSsh(ssh);
  console.log('Connected to MiSTer');

  console.log(await getAllFilenames(megaDriveRomFolder));
};

main();
