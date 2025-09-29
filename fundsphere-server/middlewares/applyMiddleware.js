const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const logger = require("../utils/logger");
const {
  colorizeMethod,
  colorizeStatus,
  colorizeTime,
} = require("../utils/colorize-msg");

const applyMiddleware = (app) => {
  // Core parsers
  app.use(require("express").json());
  app.use(cookieParser());

  // Security
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true, // for cookies
    })
  );
  app.use(helmet());
  app.use(compression());

  app.use("/uploads", (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  })

  // Logging
  if (process.env.NODE_ENV !== "production") {
    app.use(
      morgan(
        (tokens, req, res) => {
          const method = tokens.method(req, res);
          const url = tokens.url(req, res);
          const status = Number(tokens.status(req, res));
          const time = tokens["response-time"](req, res);

          return `${colorizeMethod(
            method,
            `[${method} - ${url}]`
          )} | ${colorizeStatus(status)} | ${colorizeTime(time)}`;
        },
        {
          stream: { write: (msg) => logger.info(msg.trim()) },
        }
      )
    );
  }

  // Error Handler
  app.use((err, req, res, next) => {
    logger.error(err);

    const statusCode = err.statusCode || 500;
    const response = {
      success: false,
      msg: err.message || "Internal Server Error",
    };

    // if (process.env.NODE_ENV !== "production") {
    //   response.stack = err.stack;
    // }

    res.status(statusCode).json(response);
  });
};

module.exports = applyMiddleware;
