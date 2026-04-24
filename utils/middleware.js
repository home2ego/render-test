const logger = require('./logger');

const requestLogger = (req, _res, next) => {
  logger.info(req.method, req.path);
  logger.info('---');
  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).send(`cannot ${req.method} ${req.path}`);
};

const errorHandler = (err, _req, res, _next) => {
  switch (err.name) {
    case 'CastError':
      res.status(400).send('malformatted id');
      break;
    case 'ValidationError': {
      const firstError = Object.values(err.errors)[0];
      res.status(400).send(firstError.message);
      break;
    }
  }
};

module.exports = { requestLogger, unknownEndpoint, errorHandler };
