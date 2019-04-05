let ssh;

const setSsh = _ssh => {
  ssh = _ssh;
};

const removeHiddenAndMetaFiles = ({ filename }) =>
  !(
    filename.startsWith('.') ||
    filename.startsWith('_') ||
    filename.startsWith('#')
  );

const insensitiveAlphabeticalSort = ({ filename: a }, { filename: b }) =>
  a.localeCompare(b, undefined, { sensitivity: 'base' });

const getDirItems = async directory => {
  const files = await ssh.sftp().readdir(directory);

  return files
    .sort(insensitiveAlphabeticalSort)
    .filter(removeHiddenAndMetaFiles)
    .map(({ filename, longname }) => ({
      filename,
      isDirectory: longname.startsWith('d'),
      path: `${directory}/${filename}`
    }));
};

const getDirectories = (...args) =>
  getDirItems(...args).then(items => items.filter(item => item.isDirectory));

// const getDirectoryNames = (...args) =>
//   getDirectories(...args).then(files => files.map(file => file.filename));

const getFiles = (...args) =>
  getDirItems(...args).then(items => items.filter(item => !item.isDirectory));

// const getFilenames = (...args) =>
//   getFiles(...args).then(files => files.map(file => file.filename));

const getAllFiles = async rootDir => {
  let allFiles = [];

  const currentItems = await getDirItems(rootDir);

  const currentFiles = currentItems.filter(file => !file.isDirectory);
  allFiles = [...allFiles, ...currentFiles];

  const currentFolders = currentItems.filter(file => file.isDirectory);

  const nestedFiles = await Promise.all(
    currentFolders.map(file => file.path).map(getAllFiles)
  );

  nestedFiles.forEach(filesForFolder => {
    allFiles = [...allFiles, ...filesForFolder];
  });

  return allFiles.sort(insensitiveAlphabeticalSort);
};

const getAllFilenames = (...args) =>
  getAllFiles(...args).then(files => files.map(file => file.filename));

module.exports = {
  getAllFiles,
  getAllFilenames,
  getDirectories,
  getFiles,
  setSsh
};
