import { createChartExport } from "./export/createChartExport";

export function renderChart(cat) {
  var rendererObj = cat.controls.rendererSelect
    .selectAll("option:checked")
    .data()[0];
  cat.settings.sync(cat);
  //render the new chart with the current settings
  var dataFile = cat.controls.dataFileSelect.node().value;
  var dataFilePath = cat.config.dataURL + dataFile;
  var version = cat.controls.versionSelect.node().value;
  cat.current.main = cat.controls.mainFunction.node().value;
  cat.current.sub = cat.controls.subFunction.node().value;

  d3.csv(dataFilePath, function(error, data) {
    if (error) {
      cat.status.loadStatus(cat.statusDiv, false, dataFilePath);
    } else {
      cat.status.loadStatus(cat.statusDiv, true, dataFilePath);
      if (cat.current.sub) {
        var myChart = window[cat.current.main][cat.current.sub](
          ".cat-chart",
          cat.current.config
        );
        cat.status.chartCreateStatus(
          cat.statusDiv,
          cat.current.main,
          cat.current.sub
        );
      } else {
        var myChart = window[cat.current.main](
          ".cat-chart .chart",
          cat.current.config
        );
        cat.status.chartCreateStatus(cat.statusDiv, cat.current.main);
      }

      cat.current.htmlExport = createChartExport(cat); // save the source code before init

      try {
        myChart.init(data);
      } catch (err) {
        cat.status.chartInitStatus(cat.statusDiv, false, err);
      } finally {
        cat.status.chartInitStatus(
          cat.statusDiv,
          true,
          null,
          cat.current.htmlExport
        );

        // save to server button
        if (cat.config.useServer) {
          cat.status.saveToServer(cat);
        }

        //don't print any new statuses until a new chart is rendered
        cat.printStatus = false;
      }
    }
  });
}
