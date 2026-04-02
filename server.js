require("dotenv").config();
const express = require("express");
const path = require("path");
// require("dotenv").config({ path: path.join(__dirname, ".env") });
const session = require("express-session");
const webRoutes = require("./src/routes/web");
const app = express();
app.use(
  session({
    secret: "admin_11A7_secret",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 },
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));
app.use("/", webRoutes);

const PORT = process.env.PORT || 8080;
// console.log();
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
