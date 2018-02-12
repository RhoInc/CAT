export function initFileLoad() {
  var cat = this;
  //draw the control
  var dataSection = cat.controls.wrap.select("div.control-section");
  cat.controls.dataFileLoad = dataSection
    .append("input")
    .attr("type", "file")
    .attr("class", "file-load-input");
  cat.controls.dataFileLoadButton = dataSection
    .append("button")
    .text("Load File")
    .attr("class", "file-load-button")
    .on("click", function(d) {
      console.log("you loaded a file");
      console.log(cat.controls.dataFileLoad.node());
    });
  //when a file is uploaded, add it to the data select dropdown
}
