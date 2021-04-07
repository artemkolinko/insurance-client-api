const errorHandler = (err, req, res, next) => {
  if (typeof err === 'string') {
    // custom application error
    return res.status(400).send({ error: err });
  }

  if (err.name === 'Error') {
    // custom application error
    return res.send({ error: err.message });
  }

  if (err.name === 'UnauthorizedError') {
    // jwt authentication error
    return res.status(401).send({ error: err.message });
  }

  // default to 500 server error
  return res.status(500).send({ error: err.message });
};

module.exports = errorHandler;
