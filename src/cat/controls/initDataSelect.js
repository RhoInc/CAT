export function initDataSelect(cat) {
  var dataSection = cat.controls.wrap
    .append("div")
    .attr("class", "control-section");
  dataSection.append("h3").text("2. Choose a data Set");

  cat.controls.dataFileSelect = dataSection.append("select");
  cat.controls.dataFileSelect
    .selectAll("option")
    .data(cat.config.dataFiles)
    .enter()
    .append("option")
    .text(function(d) {
      return d;
    });
  cat.controls.dataFileSelect.node().addEventListener("keypress", function(e) {
    var key = e.which || e.keyCode;
    if (key === 13) {
      // 13 is enter
      cat.controls.submitButton.node().click();
    }
  });
}
