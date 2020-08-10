const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo")(session);
const connectDB = require("./config/db");

console.log("App success");

// Load config
dotenv.config({ path: "./config/config.env" });

//passport config
require("./config/passport")(passport);

connectDB();

const App = express();

//body parser
App.use(express.urlencoded({ extended: false }));
App.use(express.json());

//methodOverride
App.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

// "scripts": {

//   "start": "node App.js",
//   "dev": "nodemon App.js"
// },

// logging;
if (process.env.NODE_ENV === "development") {
  App.use(morgan("dev"));
}

//hamburger helpers
const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
} = require("./helpers/hbs");

// handlebars
App.engine(
  ".hbs",
  exphbs({
    helpers: {
      formatDate,
      stripTags,
      truncate,
      editIcon,
      select,
    },
    defaultLayout: "main",
    extname: ".hbs",
  })
);
App.set("view engine", "hbs");

//session middleware
App.use(
  session({
    secret: "kelaidliner shawrtz",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

//passport middleware
App.use(passport.initialize());
App.use(passport.session());

//set g var
App.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

//static
App.use(express.static(path.join(__dirname, "public")));

//Routes
App.use("/", require("./routes/Start"));
App.use("/auth", require("./routes/auth"));
App.use("/stories", require("./routes/stories"));

// App.use(express.static(path.join(__dirname, "build")));
// App.get("/", function (req, res) {
//   res.sendFile(path.join(__dirname, "build"));
// });

const PORT = process.env.PORT || 3000;

// "start": "cross-env NODE_ENV=production node App",
// "dev": "cross-env NODE_ENV=development nodemon App"
App.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
