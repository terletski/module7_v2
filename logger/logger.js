const winston = require(`winston`);
const { createLogger, format, transports } = winston;

let logger = createLogger({
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    }),
    new transports.File({
      filename: `./logs/error.log`,
      level: `error`,
      format: format.combine(
        format.timestamp({ format: `YYYY-MM-DD HH:mm:ss` }),
        format.simple()
      )
    }),
    new transports.File({
      filename: `./logs/debug.log`,
      level: `debug`,
      format: format.combine(
        format.timestamp({ format: `YYYY-MM-DD HH:mm:ss` }),
        format.simple()
      )
    })
  ]
});

module.exports = {
  logger
};
