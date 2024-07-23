const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();
const cloudinary = require("cloudinary");
const fileUpload = require("express-fileupload");
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
  

dotenv.config();
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
require("dotenv").config();

const MainRoutes = require("./routes/index.routes");
app.use("/", MainRoutes);

module.exports = app;