var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require('body-parser'); 
var logger = require("morgan");
var favicon = require("serve-favicon");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const flash = require("express-flash");
const dotenv = require("dotenv");
const mqtt = require("mqtt");
const encode = require("nodejs-base64-encode");
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
app.use(passport.initialize());
app.use(passport.session());

// Connect to DB
//process.env.DB_MONGO_ENV
mongoose
  .connect(process.env.DB_MONGO_ENV
    , { useNewUrlParser: true })
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
  host: "nam1.cloud.thethings.network",
  port: 1883,
  username: "fypapplication@ttn",
  password: process.env.TTN_MQTT_PASSWORD
});

//this function receives and creates entries for CO2 Readings
client.on("connect", function () {
  console.log("connected");
  // this client subscribe has a wildcard in order to receive data from multiple nodes
  client.subscribe("v3/fypapplication@ttn/devices/+/up");
  client.on("message", function (topic, message) {
    try{
      const obj = JSON.parse(message);
      const co2Reading = encode.decode(obj.uplink_message.frm_payload, "base64");
      const deviceNode = obj.end_device_ids.dev_eui;
      const processedReading = co2Reading.split(',');
      const newReading = new Reading({ co2Reading: processedReading[0], totalPeople: processedReading[1], maskedPeople: processedReading[2], deviceNode: deviceNode });
      console.log(processedReading);
      newReading
        .save()
        .then((reading) => {
          console.log("New Reading From Device: " + reading.deviceNode);
        })
        .catch((err) => console.log("F"));
    }
    catch (err){
      console.log("F");
    }
  });
});

module.exports = app;
