const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const campgroundRoutes = require("./routes/campground");
const reviewsRoutes = require("./routes/reviews");
const usersRoutes = require("./routes/users");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const user = require("./models/user");

mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Db connection Sucessfull!!");
  })
  .catch((e) => {
    console.log("Error connecting DB", e);
  });
const app = express();
const sessionConfig = {
  secret: "thisistheactualsecretofproduction",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(flash());
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  console.log(req.session.returnTo);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/campground", campgroundRoutes);
app.use("/campground/:id/reviews", reviewsRoutes);
app.use("/", usersRoutes);
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/fakeuser", async (req, res) => {
  const newuser = new user({ email: "a3sd@gmail.com", username: "a3sd" });
  const newuserhash = await user.register(newuser, "asdf");
  res.send(newuserhash);
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 505, message = "We got an Error" } = err;
  if (!err.message) err.message = "We got an Error";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("Server Running at port 3000");
});
