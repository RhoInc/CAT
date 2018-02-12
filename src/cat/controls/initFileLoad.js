export function initFileLoad() {
  var cat = this;
  //draw the control

  cat.controls.dataFileLoad = cat.controls.dataWrap
    .append("input")
    .attr("type", "file")
    .attr("class", "file-load-input");
  cat.controls.dataFileLoadButton = cat.controls.dataWrap
    .append("button")
    .text("Load File")
    .attr("class", "file-load-button")
    .on("click", function(d) {
      console.log("you loaded a file");
      console.log(cat.controls.dataFileLoad.node());
    });
  //when a file is uploaded, add it to the data select dropdown
}
