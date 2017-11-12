var fs = require('fs');

// create empty list of charts (if it doesn't exist)
fs.writeFile('./server/pages/charts/chartList.json', "[]", { flag: 'wx' }, function(err) {
    if(err) {
        return console.log("Couldn't save file: "+err);
    }
    console.log("Created chartList.json");
});

// create fromCAT folder (if it doesn't exist)
var dir = './server/pages/charts/fromCAT';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}
