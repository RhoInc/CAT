export function initRendererSelect(cat) {
  var rendererSection = cat.controls.wrap
    .append("div")
    .attr("class", "control-section section1");

  rendererSection.append("h3").text("1. Choose a Charting Library");
  rendererSection.append("span").text("Library: ");

  cat.controls.rendererSelect = rendererSection.append("select");
  cat.controls.rendererSelect
    .selectAll("option")
    .data(cat.config.renderers)
    .enter()
    .append("option")
    .text(function(d) {
      return d.name;
    });
  var rendererSection = cat.controls.wrap
    .append("div")
    .attr("class", "control-section section2");

  cat.controls.rendererSelect.on("change", function(d) {
    cat.current = d3
      .select(this)
      .select("option:checked")
      .data()[0];

    //update the chart type configuration to the defaults for the selected renderer
    cat.controls.mainFunction.node().value = cat.current.main;
    cat.controls.versionSelect.node().value = "master";
    cat.controls.subFunction.node().value = cat.current.sub;
    cat.controls.schema.node().value = cat.current.schema;

    //update the selected data set to the default for the new rendererSection
    cat.controls.dataFileSelect
      .selectAll("option")
      .property("selected", function(e) {
        return cat.current.defaultData == e ? true : null;
      });

    //Re-initialize the chart config section
    cat.settings.set(cat);
  });
  cat.controls.rendererSelect.node().addEventListener("keypress", function(e) {
    var key = e.which || e.keyCode;
    if (key === 13) {
      // 13 is enter
      cat.controls.submitButton.node().click();
    }
  });

  rendererSection.append("span").text("Version: ");
  cat.controls.versionSelect = rendererSection.append("input");
  cat.controls.versionSelect.node().value = "master";
  cat.controls.versionSelect.on("change", function() {
    //checkVersion()
    cat.settings.set(cat);
  });
  cat.controls.versionSelect.node().addEventListener("keypress", function(e) {
    var key = e.which || e.keyCode;
    if (key === 13) {
      // 13 is enter
      cat.controls.submitButton.node().click();
    }
  });
  rendererSection.append("br");

  rendererSection
    .append("a")
    .text("More Options")
    .style("text-decoration", "underline")
    .style("color", "blue")
    .style("cursor", "pointer")
    .on("click", function() {
      d3.select(this).remove();
      rendererSection.selectAll("*").classed("hidden", false);
    });

  //specify the code to create the chart
  rendererSection
    .append("span")
    .text(" Init: ")
    .classed("hidden", true);
  cat.controls.mainFunction = rendererSection
    .append("input")
    .classed("hidden", true);
  cat.controls.mainFunction.node().value = cat.current.main;
  rendererSection
    .append("span")
    .text(".")
    .classed("hidden", true);
  cat.controls.subFunction = rendererSection
    .append("input")
    .classed("hidden", true);
  cat.controls.subFunction.node().value = cat.current.sub;
  rendererSection.append("br").classed("hidden", true);
  //Webcharts versionSelect
  rendererSection
    .append("span")
    .text("Webcharts Version: ")
    .classed("hidden", true);
  cat.controls.libraryVersion = rendererSection
    .append("input")
    .classed("hidden", true);
  cat.controls.libraryVersion.node().value = "master";
  rendererSection.append("br").classed("hidden", true);

  rendererSection
    .append("span")
    .text("Schema: ")
    .classed("hidden", true);
  cat.controls.schema = rendererSection.append("input").classed("hidden", true);
  cat.controls.schema.node().value = cat.current.schema;
  rendererSection.append("br").classed("hidden", true);
}
