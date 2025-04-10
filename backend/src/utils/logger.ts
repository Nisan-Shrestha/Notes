import winston from "winston";

const isDev = process.env.NODE_ENV === "development";

const loggerWithNameSpace = function (namespace: string) {
  return logger.child({ namespace });
};

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, namespace }) => {
      return `${timestamp} [${namespace}] ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.File({
      filename: "combined.log",
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
    new winston.transports.File({
      filename: "error.log",
      level: "error",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
    ...(isDev
      ? [
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.colorize(),
              winston.format.simple()
            ),
          }),
        ]
      : []),
  ],
});

export default loggerWithNameSpace;
