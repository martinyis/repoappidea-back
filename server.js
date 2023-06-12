const mongoose = require("mongoose");
const dotenv = require("dotenv");
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXEPTION");
  console.log(err.name, err.message);
  process.exit(1);
});
dotenv.config({ path: "./config.env" });
const app = require("./app");

//==========================DB info===========================//
//Connect to database
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose.connect(DB).then((con) => {
  console.log("DB connection successful");
});

//==========================DB info===========================//
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
