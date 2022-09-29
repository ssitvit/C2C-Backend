const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const router = express.Router();
const mongoose = require("mongoose");
const user = require("./routes/user");
const saveData = require("./routes/saveData");
const admin = require("./routes/admin");
require("dotenv").config();
const cookieParser = require("cookie-parser");

mongoose
  .connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected"))
  .catch((error) => console.log(error));

app.use((req, res, next) => {
  // res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Headers", "Authorization");
  // res.setHeader("Access-Control-Expose-Headers", "Set-Cookie");

  // res.setHeader(
  //   "Access-Control-Allow-Methods",
  //   "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  // );

  next();
});

let corsOptions = {
  origin: "https://code2clone.ieeessitvit.tech",
  // origin:"http://localhost:3000",
  credentials: true,

  methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
};

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use("/user", user);
app.use("/save", saveData);
app.use("/admin", admin);
app.get("/", (req, res) => {
  res.send("app is working");
});
const port = process.env.PORT || 3000;
const host = "0.0.0.0";

app.listen(port, host, function () {
  console.log("Server started.......");
});
