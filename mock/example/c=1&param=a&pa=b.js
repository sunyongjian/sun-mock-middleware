module.exports = function A(req, res) {
  console.log(req.query);
  const { param } = req.query;
  let data = {
    key: 'read file name params',
    fileName: 'c=1&param=a&pa=b',
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
