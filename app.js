var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var favicon = require("serve-favicon");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const dotenv = require("dotenv");
const mqtt = require("mqtt");
const encode = require("nodejs-base64-encode");
const reqFlash = require('req-flash');
const Reading = require("./models/reading");

dotenv.config({ path: "./config/config.env" });

var app = express();

require("./config/passport")(passport);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "/public")));
app.use(favicon(path.join(__dirname, "public/images/virus.png")));
app.use(flash());


app.use(express.urlencoded({ extended: false }));

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var businessRouter = require("./routes/businesses")
var reviewRouter = require("./routes/reviews");

// Express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(reqFlash());
app.use(passport.initialize());
app.use(passport.session());

// Connect to DB
//process.env.DB_MONGO_ENV
mongoose
  .connect('mongodb+srv://noodleh:uk0cY811ic@cluster0.m6ge9.mongodb.net/fyp?retryWrites=true&w=majority', { useNewUrlParser: true })
  .then((result) => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

//Routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use(businessRouter);
app.use("/reviews", reviewRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

//Connect to mqtt client
const client = mqtt.connect({
  host: "us-west.thethings.network",
  port: 1883,
  username: "noodlehapplication",
  password: "ttn-account-v2.YE4IJ8FOCgavdK8NM35bvROGeB43yXLllZTap8ZiqNw",
});

//this function receives and creates entries for CO2 Readings
client.on("connect", function () {
  console.log("connected");
  // this client subscribe has a wildcard in order to 
  // client.subscribe("noodlehapplication/devices/+/up");
  client.subscribe("noodlehapplication/devices/first-lorawan-node/up");
  client.on("message", function (topic, message) {
    const obj = JSON.parse(message);
    console.log(obj);
    const co2Reading = encode.decode(obj.payload_raw, "base64");
    const deviceNode = obj.hardware_serial;
    const newReading = new Reading({ co2Reading, deviceNode });
    newReading
      .save()
      .then((reading) => {
        console.log("New Reading: " + reading.co2Reading);
        console.log("From Device: " + reading.deviceNode);
      })
      .catch((err) => console.log(err));
  });
});

module.exports = app;
