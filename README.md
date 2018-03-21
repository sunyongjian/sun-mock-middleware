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
- 默认支持 get 和 post 请求。post 请求从 req.body 上获取参数，即你的 server 需要引入 bodyParser。
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
- query 对应文件名

比如 `api/example?param=a&pa=b` 这样的接口，我们可以在 mock 目录下定义一个 example 的文件夹，然后定义文件名为 `param=a&pa=b.js` 的文件，就可以直接根据 req.query 筛选出 mock 文件。

注意：query 是以文件名为准的，也就是 req.query 可能是 `a=1&b=2&c=3`，如果没有完全相同的(===)，只要有一个文件名为 `a=1&b=2` 或者 `b=2&c=3` 的即可以匹配。这样的好处是可以不完全根据 req.query 匹配，因为有些是本地开发用不到的，导致文件名过长，而是根据文件名自己定义哪些 query 是有用的，而且文件名定义首字母相同的情况下，文件名的 query key 越多，越靠前匹配。但是如果首字母不同，则首字母越靠前的，优先匹配。

如有不好处理的，就在 mock 文件里写点代码吧~


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
具体可以参考 [react-full-start](https://github.com/sunyongjian/react-full-start/blob/master/server/index.js)
