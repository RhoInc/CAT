export function initRendererConfig(cat) {
  var versionSection = cat.controls.wrap
    .append("div")
    .attr("class", "control-section section2");

  versionSection.append("h3").text("2. Configure the Chart Type");
  versionSection.append("span").text("Version: ");
  cat.controls.versionSelect = versionSection.append("input");
  cat.controls.versionSelect.node().value = "master";
  versionSection.append("br");

  versionSection
    .append("a")
    .text("More Options")
    .style("text-decoration", "underline")
    .style("color", "blue")
    .style("cursor", "pointer")
    .on("click", function() {
      d3.select(this).remove();
      versionSection.selectAll("*").classed("hidden", false);
    });

  //specify the code to create the chart
  versionSection.append("span").text(" Init: ").classed("hidden", true);
  cat.controls.mainFunction = versionSection
    .append("input")
    .classed("hidden", true);
  cat.controls.mainFunction.node().value = cat.current.main;
  versionSection.append("span").text(".").classed("hidden", true);
  cat.controls.subFunction = versionSection
    .append("input")
    .classed("hidden", true);
  cat.controls.subFunction.node().value = cat.current.sub;
  versionSection.append("br").classed("hidden", true);
  //Webcharts versionSelect
  versionSection
    .append("span")
    .text("Webcharts Version: ")
    .classed("hidden", true);
  cat.controls.libraryVersion = versionSection
    .append("input")
    .classed("hidden", true);
  cat.controls.libraryVersion.node().value = "master";
  versionSection.append("br").classed("hidden", true);

  versionSection.append("span").text("Schema: ").classed("hidden", true);
  cat.controls.schema = versionSection.append("input").classed("hidden", true);
  cat.controls.schema.node().value = cat.current.schema;
  versionSection.append("br").classed("hidden", true);
}
