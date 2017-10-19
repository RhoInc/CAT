import { loadLibrary } from "../loadLibrary";

export function initSubmit(cat) {
  var submitSection = cat.controls.wrap
    .append("div")
    .attr("class", "control-section");

  cat.controls.submitButton = submitSection
    .append("button")
    .attr("class", "submit")
    .text("Render Chart")
    .on("click", function() {
      cat.chartWrap.selectAll("*").remove();
      cat.statusDiv = cat.chartWrap.append("div").attr("class", "status");
      cat.statusDiv
        .append("div")
        .text("Starting to render the chart ... ")
        .classed("info", true);

      cat.chartWrap.append("div").attr("class", "chart");
      loadLibrary(cat);
    });
}
