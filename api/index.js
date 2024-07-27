require("dotenv").config();
const db = require("./lib/database");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const trimBody = require("connect-trim-body");
var cors = require("cors");
const fileUpload = require("express-fileupload");
var compression = require("compression");
app.use(compression());

app
  .use(cors())
  .use(bodyParser.json({ limit: "5mb" }))
  .use(bodyParser.urlencoded({ limit: "5mb", extended: true }))

  .use(
    fileUpload({
      limits: { fileSize: 2 * 1024 * 1024 },
    })
  )

  .use(trimBody())

  .set("view engine", "ejs")

  .use(express.static("public"))

  .get("/", (req, res) => res.send("YOU ARE AT SDS API SERVER [V1]"));

app
  .listen(process.env.SERVER_PORT, function () {
    console.log(
      "server running on http://localhost:" + process.env.SERVER_PORT
    );
  })
  .setTimeout(800000);

require("./core")(app);

module.exports = app;
