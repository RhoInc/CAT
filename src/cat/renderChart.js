export function renderChart(cat) {
  var rendererObj = cat.controls.rendererSelect
    .selectAll("option:checked")
    .data()[0];
  cat.chartWrap.selectAll("*").remove();
  cat.settings.sync(cat);
  console.log(cat.current);
  //render the new chart with the current settings
  var dataFile = cat.controls.dataFileSelect.node().value;
  var dataFilePath = cat.config.dataURL + dataFile;
  d3.csv(dataFilePath, function(data) {
    if (cat.current.sub) {
      var myChart = window[cat.current.main][cat.current.sub](
        ".cat-chart",
        cat.current.config
      );
    } else {
      var myChart = window[cat.current.main](".cat-chart", cat.current.config);
    }
    myChart.init(data);
  });
}
