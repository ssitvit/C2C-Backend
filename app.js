const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const router = express.Router();
const mongoose = require("mongoose");
const user=require('./routes/user')
require('dotenv').config();
const cookieParser = require("cookie-parser");




mongoose
  .connect(
    process.env.MONGO_DB_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("DB connected"))
  .catch((error) => console.log(error));

app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
app.use("/user", user);
app.get("/", (req, res) => {
  res.send("app is working");
});
const port = process.env.PORT || 3000;
const host = '0.0.0.0';

app.listen(port, host, function() {
  console.log("Server started.......");
});
