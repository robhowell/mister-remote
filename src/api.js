const Koa = require('koa');
const logger = require('koa-logger');
const router = require('koa-router')();
const koaBody = require('koa-body');
const cors = require('@koa/cors');

const { megaDriveRomFolder } = require('./config');
const getAllFiles = require('./getAllFiles');
const startRom = require('./startRom');

const app = new Koa();

// Middleware

app.use(logger());
app.use(koaBody());
app.use(cors());
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
    ctx.app.emit('error', err, ctx);
  }
});

// Route definitions

const romsMegadrive = async ctx => {
  const megadriveRoms = await getAllFiles(megaDriveRomFolder);
  ctx.body = megadriveRoms;
};

router.get('/roms/megadrive', romsMegadrive);

const startRomRoute = async ctx => {
  const { system, romPath } = ctx.request.body;
  console.log({ system, romPath });

  if (!(typeof system === 'undefined') && !(typeof romPath === 'undefined')) {
    await startRom({ system, romPath });
    ctx.body = 'success';
  } else {
    console.log(`/start-rom params invalid`);
    ctx.body = 'success';
  }
};

router.post('/start-rom', startRomRoute);

app.use(router.routes());

const start = apiPort => {
  app.listen(apiPort);
};

module.exports = {
  start
};
