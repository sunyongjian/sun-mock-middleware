module.exports = function A(req, res) {
  console.log(req.query);
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
