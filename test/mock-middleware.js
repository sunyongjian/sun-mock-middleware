const test = require('ava');
const request = require('request');
const express = require('express');
const path = require('path');
const SunMockMiddleware = require('../src/index');

// const app = express();
// const ROOT_DIR = path.resolve(__dirname, '../');

// app.use('/api', SunMockMiddleware({
//   pathMap: {
//     // example
//     '/a/b/c/example': '/example',
//   },
//   mockDir: `${ROOT_DIR}/mock`,
// }));

// app.listen(3333, () => {
//   console.log('\napp listening on port %s', 3333);
// });




test.cb('js', t => {
  request.get({
    baseUrl: 'http://127.0.0.1:3333',
    url: '/api/example1',

  }, (err, res, body) => {
    console.log(res, 'sss');
    if (err) t.fail('服务器响应超时！');
    if (res) {
      const { key } = JSON.parse(res.body);
      t.truthy(key);
    } else {
      t.fail('无响应内容或状态码错误！');
    }
  })
  t.end();
});

test.cb('json', t => {
  request.get({
    baseUrl: 'http://127.0.0.1:3333',
    url: '/api/example2',

  }, (err, res, body) => {
    if (res) {
      const { data } = JSON.parse(res.body);
      t.truthy(data);
    }
  })
  t.end();
});

test.cb('dir/index.js', t => {
  request.get({
    baseUrl: 'http://127.0.0.1:3333',
    url: '/api/example1',

  }, (err, res, body) => {
    if (res) {
      const { data } = JSON.parse(res.body);
      t.truthy(data);
    }
  })
  t.end();
});

test.cb('test params === a', t => {
  request.get({
    baseUrl: 'http://127.0.0.1:3333',
    url: '/api/example?param=a',

  }, (err, res, body) => {
    if (res) {
      const { data } = JSON.parse(res.body);
      if (data) {
        t.is(data.name, "a");

      } else {
        t.fail('无响应内容或状态码错误！');

      }
    }
  })
  t.end();
});

test.cb('not found module', t => {
  request.get({
    baseUrl: 'http://127.0.0.1:3333',
    url: '/api/abc',

  }, (err, res, body) => {
    if (res) {
      const { error } = JSON.parse(res.body);
      t.is(error.code, "MODULE_NOT_FOUND");
    }
  })
  t.end();
});


