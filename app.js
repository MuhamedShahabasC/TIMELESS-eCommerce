const express = require("express");
const app = express();

// Path
const path = require("path");

// View Engine
app.set("view engine", "ejs");

// Database
require("./config/db");

// Session
const session = require("express-session");
app.use(
  session({
    secret: "timeless-ecommerce-project-secretkey",
    name: "TIMELESS-Session",
    resave: false,
    saveUninitialized: true,
  })
);

// To create req object
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Path
app.use("/public", express.static(path.join(__dirname, "public")));

// Routes
const indexRouter = require("./routes/index");
app.use("/", indexRouter);

const userRouter = require("./routes/user");
app.use("/users", userRouter);

const adminRouter = require("./routes/admin");
app.use("/admin", adminRouter);

// 404 Rendering
const UserCLTN = require("./models/user/details");
app.all("*", async (req, res) => {
  const currentUser = await UserCLTN.findById(req.session.userID)
  res.render("index/404", {
    documentTitle: "404 | Page not found",
    url: req.originalUrl,
    session: req.session.userID,
    currentUser
  });
});

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
