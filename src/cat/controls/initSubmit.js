import { loadLibrary } from "../loadLibrary";

export function initSubmit(cat) {
  cat.controls.submitButton = cat.controls.submitWrap
    .append("button")
    .attr("class", "submit")
    .text("Render Chart")
    .on("click", function() {
      //Disable and/or remove previously loaded stylesheets.
      d3
        .selectAll("link")
        .filter(function() {
          return !this.href.indexOf("css/cat.css");
        })
        .property("disabled", true)
        .remove();
      d3
        .selectAll("style")
        .property("disabled", true)
        .remove();

      cat.chartWrap.selectAll("*").remove();
      cat.printStatus = true;
      cat.statusDiv = cat.chartWrap.append("div").attr("class", "status");
      cat.statusDiv
        .append("div")
        .text("Starting to render the chart ... ")
        .classed("info", true);

      cat.chartWrap.append("div").attr("class", "chart");
      loadLibrary(cat);
    });
}
