const SSH2Promise = require('ssh2-promise');

const { sshHost, bootRomFolder } = require('./config');

const getRomFilename = system => ({ 'Mega Drive': 'Genesis.rom' }[system]);

const deleteOldBootRom = async ({ ssh, system }) => {
  const bootRomFilename = getRomFilename(system);
  const bootRomPath = `${bootRomFolder}/${bootRomFilename}`;

  try {
    await ssh.exec(`rm ${bootRomPath}`);
    console.log(`"${bootRomFilename}" deleted`);
  } catch (e) {
    console.log(`"${bootRomFilename}" not found`);
  }
};

const setNewBootRom = async ({ ssh, romPath, system }) => {
  const bootRomFilename = getRomFilename(system);
  const bootRomPath = `${bootRomFolder}/${bootRomFilename}`;

  const lastSlashIndex = romPath.lastIndexOf('/');
  const romFilename = romPath.substring(lastSlashIndex + 1);

  try {
    await ssh.exec(`cp "${romPath}" ${bootRomFolder}/`);
    console.log(`"${romFilename}" copied`);
  } catch (e) {
    console.log(`"${romFilename}" copy failed`);
  }

  try {
    await ssh.exec(`mv "${bootRomFolder}/${romFilename}" "${bootRomPath}"`);
    console.log(`"${romFilename}" renamed to "${bootRomFilename}"`);
  } catch (e) {
    console.log(`"${romFilename}" rename failed`);
  }
};

const startSystem = async ({ ssh, system }) => {
  if (system === 'Mega Drive') {
    try {
      await ssh.exec(`fpga /media/fat/_Console/Genesis_20190407.rbf`);
      console.log('Started Mega Drive');
    } catch (e) {
      console.log('Failed to start Mega Drive');
    }
  }
};

const startRom = async ({ system, romPath }) => {
  const ssh = new SSH2Promise(sshHost);
  await ssh.connect();

  await deleteOldBootRom({ ssh, system });
  await setNewBootRom({ ssh, romPath, system });
  await startSystem({ ssh, system });

  ssh.close();
};

module.exports = startRom;
