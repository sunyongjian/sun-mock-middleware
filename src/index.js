const mockjs = require('mockjs');

module.exports = (options) => {
  const { pathMap = {}, mockDir } = options;
  return (req, res) => {
    const pathName = pathMap[req.path] ? pathMap[req.path] : req.path;
    const filename = `${mockDir}${pathName}`;

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

