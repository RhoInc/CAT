var express = require('express');
var app = express();

//set up bodyparser for post
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Sweet Logging middleware
var myLogger = function (req, res, next) {
  req.requestTime = Date.now()
  console.log(req.method+' logged from '+req.ip+' at '+req.requestTime )
  next()
}
app.use(myLogger)

//Handle static routes
app.use('/', express.static('./server/pages'))
app.use('/build',express.static('build'))
app.use('/css',express.static('css'))

//Add routes to Save (Export) & Load (View) charts
app.post('/export', function(req, res) {
  console.log("Request to export a chart was recieved.")

  //parse the payload to text
  function atob(str) {return new Buffer(str, 'base64').toString();};
  var htmlText = atob(req.body.chart)

  //save as an html file
  var fs = require('fs');
  var filename = "./server/pages/charts/fromCAT/"+req.requestTime+".html"
  var url = "/charts/fromCAT/"+req.requestTime+".html"
  fs.writeFile(filename, htmlText, function(err) {
      if(err) {
          return console.log("Couldn't save file: "+err);
      }
      console.log("The file was saved at "+filename);
  });

  //update the list of charts (https://stackoverflow.com/questions/36856232/write-add-data-in-json-file-using-node-js)
  var chartListPath = './server/pages/charts/chartList.json';
  req.body.time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
  fs.readFile(chartListPath, 'utf8', function readFileCallback(err, data){
      if (err){
        console.log(err);
      } else {
        var chartList = JSON.parse(data); //now it an object
        req.body.index  = chartList.length+1
        req.body.filename = filename
        req.body.url = url
        chartList.push(req.body); //add some data
        chartList_text = JSON.stringify(chartList); //convert it back to text
        fs.writeFile(chartListPath, chartList_text, 'utf8'); // write it back
      }
  });

  //return success and send the url
  res.send(
  {
    "success":true,
    "notes":'Saving Chart at '+url,
    "url":url
  });
});


//List the charts that have been saved
app.get('/list', function(req,res){
  res.send("Here is a list of saved charts.")
})

//Upload a file
app.post('/upload', function(req, res) {
  res.send('Saving file!');
});

//Start the app
app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});
