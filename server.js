//require('dotenv').config();
const bcrypt = require('bcrypt')

const express = require("express");
const routes = require("./router_components/endpoints.js");
const userRoutes = require("./router_components/userEndpoints.js");
const jwt = require("jsonwebtoken");
const cors = require('cors');

const port = process.env.PORT || 3001;

const app = express();

app.use(cors());
app.use(express.urlencoded());
app.use(express.json());


app.use('/', routes)
app.use('/user', userRoutes)

app.listen(port || 3001, function(){
    console.log("Express server listening on port %d in %s mode", port, app.settings.env);
  });
