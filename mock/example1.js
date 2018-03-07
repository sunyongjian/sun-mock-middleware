module.exports = function example1(req) {
  let data = {};
  data = {
    key: 404,
    param: req.query,
  };

  return {
    data,
    status: 400,
  };
};
