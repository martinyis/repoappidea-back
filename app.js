import express from "express";
import morgan from "morgan";
import cors from "cors"; // Import the CORS middleware
import userRouter from "./routes/userRoutes.js";
import projectRouter from "./routes/projectRoutes.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
const app = express();

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

app.use(cors()); // Enable CORS headers
app.use(helmet());
app.use(cookieParser());
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour",
});
app.use("/api", limiter);
app.use(
  express.json({
    limit: "10kb",
  })
);

//Data sanitization against noSQL qurety injection
app.use(mongoSanitize());

//Data injection against XSS
app.use(xss());

app.use(
  express.json({
    limit: "10kb",
  })
);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  console.log("Something went wrong");
});

export default app;
