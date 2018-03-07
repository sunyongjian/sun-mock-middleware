## sun-mock-middleware
express mock middleware

## Installation
`yarn add sun-mock-middleware`

## Introduction

## Feature

- 指定 mock 目录
- 文件拓展支持 js 或者是 json，可以是 a.js，也可以是 a/index.js。采用 common 的模块加载。
- 可以指定 pathMap，比如 { '/a/b/c/example': '/example'} ，当请求路径为 /a/b/c/example 的时候，就会到 mock 目录下查找 example 文件。默-认通过 request 的 path 到 mock 目录下查找。
- 清除 require 加载带来的缓存，可以 watch mock 文件的变化。
- 支持 mockjs
- 自定义响应，灵活处理。返回函数，可以自行根据请求体，参数，做不同的处理。
- 设置 cookie 和 status 码

- todo jsonp

## Usage
两个参数： pathMap， mockDir
```js
const mockMiddleware = require('sun-mock-middleware');

app.use('/api', mockMiddleware({
  pathMap: {// path 映射
  '/a/b/c/example': '/example',
  },
  mockDir: `${ROOT_PATH}/mock`, // mock 目录
}))
```
## 契约
mock server 是在一定的约定下使用的。
- 无 path 映射的情况下，request path 就是对应文件的目录。

- mock 文件中，无论导出的是 function 还是 Object，最终产出格式应如下：
```js
{
  data,
  cookies: {
    id: {
      value: 1,
      option: {
        httpOnly: true
      }
    }
  },
  status: 200
};
```
## 结合 webpack
本地 dev-server 通过 middlware 的形式启用。形如：
```js
app.use(webpackDevMiddleware(compiler, {
  // logLevel: 'silent',
  publicPath: webpackConfig.output.publicPath,
}));
app.use(webpackHotMiddleware(compiler));
```

然后在 proxy 代理的时候，api 的可以代理到 mock-server