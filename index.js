const { startup, shutdown } = require('./src/app');

(async () => {
  const { ok } = await startup();
  if (!ok) {
    await shutdown();
    process.exit(1);
  }
})();
