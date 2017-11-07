import { exportChart } from "../export/exportChart";

export function initExport(cat) {
  var settingsSection = cat.controls.wrap
    .append("div")
    .attr("class", "control-section");
  var settingsHeading = settingsSection.append("h3").html("5. Export ");

  cat.controls.exportButton = settingsSection
    .append("button")
    .text("Export Chart")
    .on("click", function() {
      var chartCode = exportChart(cat);
      alert(chartCode);
    });
}
