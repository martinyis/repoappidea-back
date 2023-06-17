import express from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import cors from "cors"; // Import the CORS middleware
import userRouter from "./routes/userRoutes.js";
import projectRouter from "./routes/projectRoutes.js";
import cookieParser from "cookie-parser";
const app = express();

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

app.use(cors()); // Enable CORS headers
app.use(cookieParser());
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
