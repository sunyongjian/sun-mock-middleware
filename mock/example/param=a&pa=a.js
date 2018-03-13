module.exports = function A(req, res) {
  console.log(req.query);
  const { param } = req.query;
  let data = {
    key: 'read file name params',
    fileName: 'param=a&pa=a',
  };

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
