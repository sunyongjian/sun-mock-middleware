'use strict';

var mockjs = require('mockjs');

module.exports = function (options) {
  var _options$pathMap = options.pathMap,
      pathMap = _options$pathMap === undefined ? {} : _options$pathMap,
      mockDir = options.mockDir;

  return function (req, res) {
    var pathName = pathMap[req.path] ? pathMap[req.path] : req.path;
    var filename = '' + mockDir + pathName;

    try {
      delete require.cache[require.resolve(filename)];
      var _module = require(filename);
      var result = {};
      if (typeof _module === 'function') {
        result = _module(req, res);
      } else {
        result = _module;
      }
      var _result = result,
          data = _result.data,
          _result$cookies = _result.cookies,
          cookies = _result$cookies === undefined ? {} : _result$cookies,
          _result$status = _result.status,
          status = _result$status === undefined ? 200 : _result$status;

      var cookiesKeys = Object.keys(cookies);
      cookiesKeys.forEach(function (key) {
        res.cookie(key, cookies[key].value, cookies[key].option);
      });
      res.status(status);
      res.send(mockjs.mock(data));
    } catch (e) {
      console.log(e, 'error');
      res.send({
        error: e
      });
    }
  };
};