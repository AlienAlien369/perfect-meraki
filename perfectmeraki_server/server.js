const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const pinoHttp = require("pino-http");
const connectDB = require("./config/db");
const logger = require("./config/logger");
const { notFound, errorHandler } = require("./middleware/errorHandler");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Render (and most PaaS) sit behind a reverse proxy - needed for correct
// client IPs (rate limiting) and for the `secure` cookie flag to work.
app.set("trust proxy", 1);

app.use(helmet());
app.use(pinoHttp({ logger }));

// Middleware to handle CORS
const allowedOrigins = [];
if (process.env.NODE_ENV == "production") {
  allowedOrigins.push("https://perfect-meraki.vercel.app");
} else {
  allowedOrigins.push("http://localhost:3000");
  allowedOrigins.push("http://192.168.0.103:5173");
}

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/user"));
app.use("/api/admin", require("./routes/admin"));

// Root route with proper response
app.get("/", (req, res) => {
  res.send(`perfect meraki is running on port ${PORT}`);
});

app.use(notFound);
app.use(errorHandler);

// Only connect/listen when run directly (`node server.js`) - importing this
// module (e.g. from tests via supertest) should never open a real port or
// a real DB connection.
if (require.main === module) {
  connectDB().catch((err) => logger.error(err, "Failed to connect to MongoDB"));

  app.listen(PORT, () => {
    logger.info(`Server is running on port no ${PORT}`);
  });
}

module.exports = app;
