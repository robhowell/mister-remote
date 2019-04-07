const api = require('./api');
const { apiPort } = require('./config');

const main = async () => {
  api.start(apiPort);
  console.log(`Started API on port ${apiPort}`);
};

main();
