require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const expressSession = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("@prisma/client");
const passport = require("passport");
require("./auth/auth");
const compression = require("compression");
const helmet = require("helmet");
const RateLimit = require("express-rate-limit");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const uploadsRouter = require("./routes/uploads");

const app = express();

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(compression());
app.use(helmet());
app.disable('x-powered-by');

const limiter = RateLimit({  // Set up rate limiter: max 20 reqs/min
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});

app.use(limiter);

app.use(logger("dev"));
app.use(express.json());
app.use(
  expressSession({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, //ms
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      httpOnly: true, // Prevent client-side JS access
      sameSite: "strict", // Prevent CSRF
    },
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  }),
);
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public"), {
  maxAge: "1d", // Cache files for 1 day
  setHeaders: (res, path) => {
    res.set("x-content-type-options", "nosniff");
  },
}));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/uploads", uploadsRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err); // Delegate to the default Express error handler
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  try {
    // Render the error page
    res.status(err.status || 500);
    res.render("error");
  } catch (e) {
    next(e);
  }
});

module.exports = app;
