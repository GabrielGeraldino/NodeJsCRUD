require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const apiRouter = require("./routes/apiRouter");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", apiRouter);

app.use("/", express.static(path.join(__dirname, "/public")));

const port = process.env.PORT || 3000;
app.listen(port);
