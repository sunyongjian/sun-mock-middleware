module.exports = function A(req, res) {

  const { param } = req.query;
  let data = {
    key: 'params not match',
  };

  if (param === 'a') {
    data = require('./a');
  }
  if (param === 'b') {
    data = require('./b');
  }
  console.log(data, 'mock');
  return {
    data,
    cookies: {
      id: {
        value: 1,
      },
    },
    status: 200,
  };
};
