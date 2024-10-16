const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const indexRouter = require("./routes/index");
require("dotenv").config();

const app = express();
const MONGODB_URI_PROD = process.env.MONGODB_URI_PROD;
const PORT = process.env.PORT || 5000;
console.log("mongouri", MONGODB_URI_PROD);
//CORS 미들웨어 먼저 설정
app.use(cors());
app.use(bodyParser.json());
// 위의 미들웨어 설정후 라우터 설정
app.use("/api", indexRouter);

const mongoURL = MONGODB_URI_PROD;
mongoose
  .connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("mongoose connected");
  })
  .catch((err) => {
    console.log("DB connection is failed", err);
  });

app.listen(PORT, () => {
  console.log(`server is working on ${PORT}`);
});
