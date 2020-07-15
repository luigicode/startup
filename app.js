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

// Load config
dotenv.config({ path: "./config/config.env" });

//passport config
require("./config/passport")(passport);

connectDB();

const app = express();

//body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//methodOverride
app.use(
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

//   "start": "node app.js",
//   "dev": "nodemon app.js"
// },

//logging
// if (process.env.NODE_ENV === "development") {
//   app.use(morgan("dev"));
// }

//hamburger helpers
const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
} = require("./helpers/hbs");

// handlebars
app.engine(
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
app.set("view engine", "hbs");

//session middleware
app.use(
  session({
    secret: "kelaidliner shawrtz",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//set g var
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

//static
app.use(express.static(path.join(__dirname, "public")));

//Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));

const PORT = process.env.PORT || 3000;

// "start": "cross-env NODE_ENV=production node app",
// "dev": "cross-env NODE_ENV=development nodemon app"
 ${process.env.NODE_ENV} mode
 app.listen(PORT, console.log(`server running on ${PORT}`));
