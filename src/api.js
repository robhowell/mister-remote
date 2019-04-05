const Koa = require('koa');
const logger = require('koa-logger');
const router = require('koa-router')();
const koaBody = require('koa-body');
const cors = require('@koa/cors');

const { megaDriveRomFolder } = require('./config');
const { getAllFiles } = require('./remoteFiles');

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

router.get('/roms/megadrive', romsMegadrive);

app.use(router.routes());

/**
 * Post listing.
 */

async function romsMegadrive(ctx) {
  const megadriveRoms = await getAllFiles(megaDriveRomFolder);
  ctx.body = megadriveRoms;
  // await ctx.render('list', { posts: posts });
}

const start = apiPort => {
  app.listen(apiPort);
};

module.exports = {
  start
};
