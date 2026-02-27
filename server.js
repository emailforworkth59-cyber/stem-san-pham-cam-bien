const express = require("express");
const path = require("path");
const webRoutes = require("./src/routes/web");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

app.use("/", webRoutes);

app.listen(3000, () =>
  console.log("Server MVC Ready at http://localhost:3000"),
);
