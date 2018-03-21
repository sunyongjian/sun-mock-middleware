const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const SunMockMiddleware = require('./src/index');

const app = express();
const ROOT_DIR = path.resolve(__dirname);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

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