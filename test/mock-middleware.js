const test = require('ava');
const request = require('request');
const path = require('path');


test.cb('no query: .js', t => {
  request.get({
    baseUrl: 'http://127.0.0.1:3333',
    url: '/api/example1',

  }, (err, res, body) => {
    if (err) t.fail('服务器响应超时！');
    if (res) {
      const { key } = JSON.parse(res.body);
      t.truthy(key);
      t.end();
    } else {
      t.fail('无响应内容或状态码错误！');
    }
  })
});

test.cb('no query: .json', t => {
  request.get({
    baseUrl: 'http://127.0.0.1:3333',
    url: '/api/example2',

  }, (err, res, body) => {
    if (res) {
      const { data = {} } = JSON.parse(res.body);
      t.truthy(data);
      t.end();
    }
  })
});

test.cb('find: dir/index.js', t => {
  request.get({
    baseUrl: 'http://127.0.0.1:3333',
    url: '/api/example1',

  }, (err, res, body) => {
    if (res) {
      const { data = {} } = JSON.parse(res.body);
      t.truthy(data);
      t.end();
    }
  })
});

test.cb('simple query: test param === a', t => {
  request.get({
    baseUrl: 'http://127.0.0.1:3333',
    url: '/api/example?param=a',

  }, (err, res, body) => {
    if (res) {
      const { name } = JSON.parse(res.body);
      if (name) {
        t.is(name, "a");
        t.end();
      } else {
        t.fail('无响应内容或状态码错误！');

      }
    }
  })
});

test.cb('error: not found module', t => {
  request.get({
    baseUrl: 'http://127.0.0.1:3333',
    url: '/api/abc',

  }, (err, res, body) => {
    // console.log(res);
    if (res) {
      const { error } = JSON.parse(res.body);
      t.is(error.code, "MODULE_NOT_FOUND");
      t.end();
    }
  })
});

test.cb('usual: define query file', t => {
  request.get({
    baseUrl: 'http://127.0.0.1:3333',
    url: '/api/example?param=a&pa=b',

  }, (err, res, body) => {
    if (res) {
      const { fileName } = JSON.parse(res.body);
      t.truthy(fileName);
      t.end();
    }
  })
});



test.cb('usual: define query file', t => {
  request.get({
    baseUrl: 'http://127.0.0.1:3333',
    url: '/api/example?zzz=1&xxx=2',

  }, (err, res, body) => {
    if (res) {
      const { fileName } = JSON.parse(res.body);
      t.truthy(fileName);
      t.end();
    }
  })
});

test.cb('req.query 限定 > 文件名', t => {
  request.get({
    baseUrl: 'http://127.0.0.1:3333',
    url: '/api/example?param=a&pa=b&c=1&d=4',

  }, (err, res, body) => {
    if (res) {
      const { fileName } = JSON.parse(res.body);
      t.is(fileName, 'c=1&param=a&pa=b');
      t.end();
    }
  })
});

test.cb('req 的 query 和 文件名 query 顺序不同', t => {
  request.get({
    baseUrl: 'http://127.0.0.1:3333',
    url: '/api/example?pa=a&param=a',

  }, (err, res, body) => {
    if (res) {
      const { fileName } = JSON.parse(res.body);
      t.is(fileName, 'param=a&pa=a');
      t.end();
    }
  })
});

test.cb('同一种 req.query，取文件名靠前的', t => {
  request.get({
    baseUrl: 'http://127.0.0.1:3333',
    url: '/api/example?param=a&c=1&pa=b',

  }, (err, res, body) => {
    if (res) {
      const { fileName } = JSON.parse(res.body);
      t.is(fileName, 'c=1&param=a&pa=b');
      t.end();
    }
  })
});

test.cb('同一种 req.query，取文件名靠前的，除非完全匹配，即顺序相同', t => {
  request.get({
    baseUrl: 'http://127.0.0.1:3333',
    url: '/api/example?param=a&pa=b&c=1',

  }, (err, res, body) => {
    if (res) {
      const { fileName } = JSON.parse(res.body);
      t.is(fileName, 'param=a&pa=b&c=1');
      t.end();
    }
  })
});


test.cb('test post request', t => {
  request.post({
    baseUrl: 'http://127.0.0.1:3333',
    url: '/api/example',
    form: {
      param: 'a',
      pa: 'b'
    }
  }, (err, res, body) => {
    if (res) {
      const { fileName } = JSON.parse(res.body);
      if (fileName) {
        t.is(fileName, "param=a&pa=b");
        t.end();
      } else {
        t.fail('无响应内容或状态码错误！');
        t.end();
      }
    }
  })
});


test.cb('test post request2', t => {
  request.post({
    baseUrl: 'http://127.0.0.1:3333',
    url: '/api/example',
    form: {
      param: 'a',
      c: '1',
      pa: 'b',
    }
  }, (err, res, body) => {
    if (res) {
      const { fileName } = JSON.parse(res.body);
      t.is(fileName, "c=1&param=a&pa=b");
      t.end();
    }
  })
});