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
      isDirectory: longname.startsWith('d')
    }));
};

const getDirectories = (...args) =>
  getDirItems(...args).then(items => items.filter(item => item.isDirectory));

const getDirectoryNames = (...args) =>
  getDirectories(...args).then(files => files.map(file => file.filename));

const getFiles = (...args) =>
  getDirItems(...args).then(items => items.filter(item => !item.isDirectory));

const getFilenames = (...args) =>
  getFiles(...args).then(files => files.map(file => file.filename));

const getAllFilenames = async rootDir => {
  let filenames = [];
  const currentFilenames = await getFilenames(rootDir);
  const currentFilePaths = currentFilenames.map(
    filename => `${rootDir}/${filename}`
  );
  filenames = [...filenames, ...currentFilePaths];

  const currentFolders = await getDirectoryNames(rootDir);
  const currentFolderPaths = currentFolders.map(dir => `${rootDir}/${dir}`);

  const nestedFilenames = await Promise.all(
    currentFolderPaths.map(currentFolderPath =>
      getFilenames(currentFolderPath).then(filenames =>
        filenames.map(filename => `${currentFolderPath}/${filename}`)
      )
    )
  );

  nestedFilenames.forEach(filenamesForFolder => {
    filenames = [...filenames, ...filenamesForFolder];
  });

  return filenames;
};

module.exports = {
  getAllFilenames,
  getDirectories,
  getDirectoryNames,
  getFiles,
  getFilenames,
  setSsh
};
