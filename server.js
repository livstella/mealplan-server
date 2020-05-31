const express = require("express");
const routes = require("./router_components/endpoints.js");
var cors = require('cors');

const app = express();
app.use(cors());

app.get('/test', (req, res) => {
    res.send('Hello')
})

app.use('/', routes)

app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });