const express = require("express");
const app = express();

// Path
const path = require("path");

// View Engine
app.set("view engine", "ejs");

// Database
require('./config/db');

// Session
const session = require('express-session')
app.use(session({
  secret: 'timeless-ecommerce-project-secretkey',
  name: 'TIMELESS-Session',
  resave: false,
  saveUninitialized: true
}))

// Application configs
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Path
app.use("/public", express.static(path.join(__dirname, "public")));

// Routes
const indexRouter = require("./routes/index");
app.use("/", indexRouter);

const userRouter = require("./routes/user");
app.use("/user", userRouter);

const adminRouter = require("./routes/admin");
app.use("/admin", adminRouter);


// Create Server
require("dotenv").config();
const PORT = process.env.PORT;
app.listen(PORT, (err) => {
  if (err) {
    console.log("Error starting server: " + err);
  } else {
    console.log("Listening on http://127.0.0.1:8080");
  }
});
