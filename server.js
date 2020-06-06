//require('dotenv').config();

const express = require("express");
const routes = require("./router_components/endpoints.js");
const userRoutes = require("./router_components/userEndpoints.js");
const jwt = require("jsonwebtoken");
var cors = require('cors');

const app = express();

app.use(cors());
app.use(express.urlencoded());
app.use(express.json());



app.use('/', routes)
app.use('/user', userRoutes)

app.listen(process.env.PORT || 3001, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });
