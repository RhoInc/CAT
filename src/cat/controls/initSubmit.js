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
      loadLibrary(cat);
    });
}
