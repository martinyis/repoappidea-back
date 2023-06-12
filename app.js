import express from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import userRouter from "./routes/userRoutes.js";
const app = express();

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}
app.use(
  express.json({
    limit: "10kb",
  })
);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// app.use('/api/v1/tours', tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  console.log("It is wrong route");
});

//export app
export default app;
