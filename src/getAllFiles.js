const SSH2Promise = require('ssh2-promise');
const { sshHost } = require('./config');

const onlyUsEuropeAndJapan = ({ path }) =>
  path.startsWith('/media/fat/Genesis/1\\ US') ||
  path.startsWith('/media/fat/Genesis/2\\ Europe') ||
  path.startsWith('/media/fat/Genesis/2\\ Japan');

const removeHiddenAndMetaFiles = ({ filename }) =>
  !(
    filename.startsWith('.') ||
    filename.startsWith('_') ||
    filename.startsWith('#') ||
    filename.endsWith('txt') ||
    filename === ''
  );

const insensitiveAlphabeticalSort = ({ filename: a }, { filename: b }) =>
  a.localeCompare(b, undefined, { sensitivity: 'base' });

function unescapeString(v) {
  eval('v = "' + v + '"'); // eslint-disable-line no-eval
  return v;
}

const getFileInfo = fileString => {
  const permissions = fileString.substr(17, 10);
  const size = parseInt(fileString.substr(46, 13));
  const path = fileString.substr(73);

  const pathUnescaped = unescapeString(path);
  const lastSlashIndex = pathUnescaped.lastIndexOf('/');
  const filename = pathUnescaped.substring(lastSlashIndex + 1);

  return {
    permissions,
    size,
    path,
    filename,
    pathUnescaped
  };
};

const getAllFiles = async rootDir => {
  const ssh = new SSH2Promise(sshHost);
  await ssh.connect();

  const filesString = await ssh.exec(`find ${rootDir} -type f -ls`);
  const filesStringArray = filesString.split('\n');
  const files = filesStringArray.map(getFileInfo);
  const romFiles = files
    .filter(removeHiddenAndMetaFiles)
    .filter(onlyUsEuropeAndJapan)
    .sort(insensitiveAlphabeticalSort);

  ssh.close();

  return romFiles;
};

module.exports = getAllFiles;
