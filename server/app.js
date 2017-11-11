var express = require('express');
var app = express();

//Logging middleware

var myLogger = function (req, res, next) {
  req.requestTime = Date.now()
  console.log(req.route+' logged from '+req.ip+' at '+req.requestTime )
  next()
}

app.use('/', express.static('./server/pages'))
app.use('/build',express.static('build'))
app.use('/css',express.static('css'))

//app.use("/build", express.static('build'))
//app.use("/css", express.static('css'))

app.use(myLogger)

/*
app.get('/hi', function(req, res) {
  res.send('Hello World!');
});

app.get('/about', function(req, res) {
  res.send('About this wiki');
});
*/

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});
