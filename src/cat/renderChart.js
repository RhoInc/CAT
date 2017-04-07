export function renderChart(cat){
  var rendererObj = cat.controls.rendererSelect.selectAll("option:checked").data()[0];
  cat.chartWrap.selectAll("*").remove()

  //render the new chart with the current settings
  var dataFile = cat.controls.dataFileSelect.node().value
  var dataFilePath = cat.config.dataURL + dataFile
  var chartSettings = JSON.parse(cat.controls.settingsInput.node().value);
  console.log('  Settings: ' + cat.controls.settingsInput.node().value.replace(/\t/g, ' ').replace(/\n| +(?= )/g, ''));
  console.log('  Data: ' + dataFile);
  d3.csv(dataFilePath, function(data) {
    console.log(rendererObj)
    if(rendererObj.sub){
      console.log("sub")
      var myChart = window[rendererObj.main][rendererObj.sub]('.cat-chart',chartSettings);
    }else{
      console.log("nosub")
      var myChart = window[rendererObj.main]('.cat-chart',chartSettings);
    }
    console.log(data)
    console.log(cat)
    console.log(myChart)
    myChart.init(data)
  });
}
