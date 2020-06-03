require("dotenv").config();

const express = require("express");
const cors = require("cors");
const routes = require("./router_components/endpoints.js");
const userRoutes = require("./router_components/user.js");

const app = express();

app.use(express.urlencoded());
app.use(express.json());
app.use(cors());

app.use("/", routes);
app.use("/user", userRoutes);

app.get("/test", (req, res) => {
  res.send("Hello");
});

app.listen(3000, function () {
  console.log(
    "Express server listening on port %d in %s mode",
    this.address().port,
    app.settings.env
  );
});
