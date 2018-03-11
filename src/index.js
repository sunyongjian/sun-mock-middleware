const mockjs = require('mockjs');
const fs = require('mz/fs');

module.exports = (options) => {
  const { pathMap = {}, mockDir } = options;
  return async (req, res) => {
    const pathName = pathMap[req.path] ? pathMap[req.path] : req.path;
    const filename = `${mockDir}${pathName}`;
    const { query } = req;
    if (Object.keys(query).length) {// 存在 query，先当做文件夹读
      try {
        const fileList = await fs.readdir(filename);
        const fileNameList = fileList.map((item) => {
          return item.split('.')[0];
        })
        .filter(i => !!i)
        .filter(i => i.includes('='))
        .map(item => {
          return item.split('&');
        })
        .reduce((res, cur) => {
          const o = {};
          for(const value of cur) {
            const [ k, v ] = value.split("=");
            o[k] = v;
          }
          return [...res, o]
        }, [])
        console.log(fileNameList, 'aa');
      } catch (e) {

      }
    }
    try {
      delete require.cache[require.resolve(filename)];
      const module = require(filename);
      let result = {};
      if (typeof module === 'function') {
        result = module(req, res);
      } else {
        result = module;
      }
      const { data, cookies = {}, status = 200 } = result;
      const cookiesKeys = Object.keys(cookies);
      cookiesKeys.forEach((key) => {
        res.cookie(key, cookies[key].value, cookies[key].option);
      });
      res.status(status);
      res.send(mockjs.mock(data));
    } catch (e) {
      console.log(e, 'error');
      res.send({
        error: e,
      });
    }
  };
};

