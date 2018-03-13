const mockjs = require('mockjs');
const fs = require('mz/fs');

const queryToString = (queryObj) => {
  const queryFile = Object.keys(queryObj).reduce((res, cur) => {
    return res += `${cur}=${queryObj[cur]}&`
  }, '');
  return queryFile.substr(0, queryFile.length - 1);
}

module.exports = (options) => {
  const { pathMap = {}, mockDir } = options;
  return async (req, res) => {
    const pathName = pathMap[req.path] ? pathMap[req.path] : req.path;
    let filename = `${mockDir}${pathName}`;
    const { query } = req;
    if (Object.keys(query).length) {// 存在 query，先当做文件夹读
      try {
        const fileList = await fs.readdir(filename);
        // 去掉后缀名，仅仅支持 xx.xx
        const fileNameList = fileList.map((item) => {
          return item.split('.')[0];
        })
        const queryString = queryToString(query);
        console.log(fileNameList, 'fileNameList');
        if (fileNameList.filter(file => file === queryString).length) {
          // query 跟文件名完全匹配
          filename += `/${queryString}`;

        } else {
          // 文件夹下所有文件名，遍历匹配部分符合的
          const queryList = fileNameList
            .filter(i => !!i && i.includes('='))
            .map(item => {
              return item.split('&');
            })
            .reduce((res, cur) => {
              const o = {};
              for (const value of cur) {
                const [k, v] = value.split("=");
                o[k] = v;
              }
              return [...res, o]
            }, []);
          console.log(queryList, 'queryList');
          const l = queryList.filter(q => {
            const qs = Object.keys(q);
            let f = true;
            for (const k of qs) {
              if (!req.query[k]) f = false;
            }
            return f;
          })

          if (l.length) {
            const queryObj = l[0];
            const queryFile = Object.keys(queryObj).reduce((res, cur) => {
              return res += `${cur}=${queryObj[cur]}&`
            }, '');
            filename += '/' + queryFile.substr(0, queryFile.length - 1);
          }

        }
      } catch (e) {
        console.log(e);
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

