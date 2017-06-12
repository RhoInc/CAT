import { loadLibrary } from "../loadLibrary";

export function init(cat) {
  var settings = cat.config;
  var current = settings.renderers[0];

  //submit
  cat.controls.submitButton = cat.controls.wrap
    .append("button")
    .attr("class", "submit")
    .text("Render Chart");

  //Webcharts versionSelect
  var libraryVersionWrap = cat.controls.wrap
    .append("div")
    .attr("class", "webcharts-wrap");
  libraryVersionWrap.append("span").text("Webcharts Version:");
  cat.controls.libraryVersion = libraryVersionWrap.append("input");
  cat.controls.libraryVersion.node().value = "master";

  //Choose a renderer
  var rendererWrap = cat.controls.wrap
    .append("div")
    .attr("class", "control-wrap");
  rendererWrap.append("span").text("Renderer:");
  cat.controls.rendererSelect = rendererWrap.append("select");
  cat.controls.rendererSelect
    .selectAll("option")
    .data(settings.renderers)
    .enter()
    .append("option")
    .text(function(d) {
      return d.name;
    });

  cat.controls.rendererSelect.on("change", function(d) {
    var current = d3.select(this).select("option:checked").data()[0];
    cat.controls.mainFunction.node().value = current.main;
    cat.controls.subFunction.node().value = current.sub;
  });

  //Choose a version
  rendererWrap.append("span").text("  Version:");
  cat.controls.versionSelect = rendererWrap.append("input");
  cat.controls.versionSelect.node().value = "master";

  //specify the code to create the chart
  rendererWrap.append("span").text(" Init:");
  cat.controls.mainFunction = rendererWrap.append("input");
  cat.controls.mainFunction.node().value = current.main;
  rendererWrap.append("span").text(".");
  cat.controls.subFunction = rendererWrap.append("input");
  cat.controls.subFunction.node().value = current.sub;

  //Choose a data file
  var datafileWrap = cat.controls.wrap
    .append("div")
    .attr("class", "control-wrap");

  datafileWrap.append("span").text("Data:");
  cat.controls.dataFileSelect = datafileWrap.append("select");
  cat.controls.dataFileSelect
    .selectAll("option")
    .data(settings.dataFiles)
    .enter()
    .append("option")
    .text(function(d) {
      return d;
    });

  //Edit the settings
  var settingsWrap = cat.controls.wrap
    .append("div")
    .attr("class", "control-wrap");
  settingsWrap.append("span").text("Settings:");
  settingsWrap.append("br");
  cat.controls.settingsInput = settingsWrap
    .append("textarea")
    .attr("rows", 10)
    .attr("cols", 50)
    .text("{}");

  cat.controls.submitButton.on("click", function() {
    loadLibrary(cat);
  });
}
