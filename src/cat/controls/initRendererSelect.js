export function initRendererSelect(cat) {
  cat.controls.rendererWrap.append("h3").text("1. Choose a Charting Library");
  cat.controls.rendererWrap.append("span").text("Library: ");

  cat.controls.rendererSelect = cat.controls.rendererWrap.append("select");
  cat.controls.rendererSelect
    .selectAll("option")
    .data(cat.config.renderers)
    .enter()
    .append("option")
    .text(function(d) {
      return d.name;
    });

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
  cat.controls.rendererWrap.append("br");
  cat.controls.rendererWrap.append("span").text("Version: ");
  cat.controls.versionSelect = cat.controls.rendererWrap.append("input");
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
  cat.controls.rendererWrap.append("br");

  cat.controls.rendererWrap
    .append("a")
    .text("More Options")
    .style("text-decoration", "underline")
    .style("color", "blue")
    .style("cursor", "pointer")
    .on("click", function() {
      d3.select(this).remove();
      cat.controls.rendererWrap.selectAll("*").classed("hidden", false);
    });

  //specify the code to create the chart
  cat.controls.rendererWrap
    .append("span")
    .text(" Init: ")
    .classed("hidden", true);
  cat.controls.mainFunction = cat.controls.rendererWrap
    .append("input")
    .classed("hidden", true);
  cat.controls.mainFunction.node().value = cat.current.main;
  cat.controls.rendererWrap
    .append("span")
    .text(".")
    .classed("hidden", true);
  cat.controls.subFunction = cat.controls.rendererWrap
    .append("input")
    .classed("hidden", true);
  cat.controls.subFunction.node().value = cat.current.sub;
  cat.controls.rendererWrap.append("br").classed("hidden", true);
  //Webcharts versionSelect
  cat.controls.rendererWrap
    .append("span")
    .text("Webcharts Version: ")
    .classed("hidden", true);
  cat.controls.libraryVersion = cat.controls.rendererWrap
    .append("input")
    .classed("hidden", true);
  cat.controls.libraryVersion.node().value = "master";
  cat.controls.rendererWrap.append("br").classed("hidden", true);

  cat.controls.rendererWrap
    .append("span")
    .text("Schema: ")
    .classed("hidden", true);
  cat.controls.schema = cat.controls.rendererWrap
    .append("input")
    .classed("hidden", true);
  cat.controls.schema.node().value = cat.current.schema;
  cat.controls.rendererWrap.append("br").classed("hidden", true);
}
