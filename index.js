const express = require("express");
const app = express();
const cors = require("cors");
const CONFIG = require("./config");
const connectToMongoDB = require("./config/connectToMongoDB");
const routes = require("./routes");
const cookieParser = require('cookie-parser');
const errorHandler = require("./middlewares/errorHandler");
const corsOptions = require("./config/corsOptions");


// mongoose
//   .connect(CONFIG.DB.MONGO_URL)
//   .then(() => console.log("DB Connection Successfull!"))
//   .catch((err) => {
//     console.log(err);
//   });
connectToMongoDB();

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  // res.setHeader("Access-Control-Allow-Origin", allowOriginUrl);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  // Request methods you wish to allow
  res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );


  // Request headers you wish to allow
  res.setHeader(
      "Access-Control-Allow-Headers",
      "Authorization,X-Requested-With,content-type"
  );
  //res.header('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("/api", routes);
app.use(errorHandler);


const server = app.listen(CONFIG.PORT.EXPRESS, () => {
  console.log("Backend server is running!");
});

module.exports = server;