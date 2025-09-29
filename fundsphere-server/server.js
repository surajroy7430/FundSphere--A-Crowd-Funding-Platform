require("dotenv").config({ quiet: true });
const express = require("express");
const path = require("path");
const logger = require("./utils/logger");
const authRouter = require("./routes/auth.routes");
const adminRouter = require("./routes/admin.routes");
const profileRouter = require("./routes/profile.routes");
const campaignRouter = require("./routes/campaign.routes");
const applyMiddleware = require("./middlewares/applyMiddleware");
const { connectToDB, disconnectDB } = require("./config/db");

const app = express();
applyMiddleware(app);

let isDBConnected = false;

// Health check route
app.get("/", (req, res) => {
  logger.info("GET / - Health check endpoint called");
  res.send({
    message: `Server is running...`,
    db: isDBConnected ? "Connected to MongoDB" : "Failed to connect to MongoDB",
  });
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API routes
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/profile", profileRouter);
app.use("/api/campaigns", campaignRouter);

// Unknown Routes (404)
app.use((req, res, next) => {
  const error = new Error("Route Not Found");
  error.statusCode = 404;
  next(error);
});

const startServer = async () => {
  try {
    isDBConnected = await connectToDB();

    const PORT = Number(process.env.PORT || 4000);
    const server = app.listen(PORT, () =>
      logger.info(
        `Server running on port ${PORT} in ${process.env.NODE_ENV} mode`
      )
    );

    const gracefulShutdown = async (signal) => {
      logger.warn(`Received ${signal}. Shutting down server...`);

      server.close(async () => {
        logger.warn("HTTP server closed");
        await disconnectDB();
        process.exit(0);
      });

      setTimeout(() => {
        logger.error("Forcing shutdown...");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
