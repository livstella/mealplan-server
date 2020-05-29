const express = require("express");
const routes = require("./router_components/endpoints.js")
require('dotenv').config();

const app = express();


app.get('/test', (req, res) => {
    res.send('Hello')
})

app.use('/', routes)

app.listen(process.env.PORT || 3000, function(){
    console.log(process.env.DBport, process.env.DBuser);
  });