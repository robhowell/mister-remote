const SSH2Promise = require('ssh2-promise');
 
const ssh = new SSH2Promise({
  host: '192.168.1.134',
  username: 'root',
  password: '1'
});
 
const main = async () => {
  await ssh.connect();
  console.log("Connected to MiSTer");

  const sftp = ssh.sftp();
  const directories = await sftp.readdir("/")
  const dirNames = directories.map(directory => directory.filename)
  console.dir(dirNames);
};

main();