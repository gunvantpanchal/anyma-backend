const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const Router = require("../routes");
const path=require("path");
dotenv.config();
const app = express();

app.use(
  cors({
    origin: "*",
    // credentials: true,
  })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client/dist")));
app.use(
  "/company/cover",
  express.static(path.join(__dirname, "../public/company"))
);
app.use(
  "/company/profile",
  express.static(path.join(__dirname, "../public/company"))
);
app.use(
  "/profile/pic",
  express.static(path.join(__dirname, "../public/profile"))
);
app.use("/api/v1", Router);

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send("Internal server error");
});

app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

module.exports = app;
