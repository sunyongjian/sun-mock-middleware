const express = require('express');
const path = require('path');
const SunMockMiddleware = require('./lib/index');

const app = express();
const ROOT_DIR = path.resolve(__dirname);

app.use('/api', SunMockMiddleware({
  pathMap: {
    // example
    '/a/b/c/example': '/example',
  },
  mockDir: `${ROOT_DIR}/mock`,
}));

app.listen(3333, () => {
  console.log('\napp listening on port %s', 3333);
});