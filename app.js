const express = require("express");
const morgan = require("morgan");
const app = express();
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
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
  // console.log(req.headers);
  next();
});

// app.use('/api/v1/tours', tourRouter);
// app.use('/api/v1/users', userRouter);

app.all("*", (req, res, next) => {
  console.log("It is wrong route");
});

module.exports = app;
