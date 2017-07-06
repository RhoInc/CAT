import { loadLibrary } from "../loadLibrary";

export function init(cat) {
  var settings = cat.config;
  var current = settings.renderers[0];
  var controlWrap = cat.controls.wrap;

  // minimize controls
  var minimize = controlWrap
    .append("div")
    .attr("class", "minimize")
    .text("<<")
    .style("float", "left")
    .on("click", function() {
      cat.controls.wrap.classed("hidden", true);
      cat.wrap
        .insert("div", ":first-child")
        .attr("class", "maximize")
        .text(">>")
        .on("click", function() {
          cat.controls.wrap.classed("hidden", false);
          d3.select(this).remove();
        });
    });

  //submit
  var submitSection = controlWrap
    .append("div")
    .attr("class", "control-section");
  cat.controls.submitButton = submitSection
    .append("button")
    .attr("class", "submit")
    .text("Render Chart")
    .on("click", function() {
      loadLibrary(cat);
    });
  //Choose a renderer
  var rendererSection = controlWrap
    .append("div")
    .attr("class", "control-section");
  rendererSection.append("span").text("Renderer:");
  cat.controls.rendererSelect = rendererSection.append("select");
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
  var versionSection = controlWrap
    .append("div")
    .attr("class", "control-section");
  versionSection.append("span").text("  Version:");
  cat.controls.versionSelect = versionSection.append("input");
  cat.controls.versionSelect.node().value = "master";

  //specify the code to create the chart
  var initSection = controlWrap.append("div").attr("class", "control-section");
  initSection.append("span").text(" Init:");
  cat.controls.mainFunction = initSection.append("input");
  cat.controls.mainFunction.node().value = current.main;
  initSection.append("span").text(".");
  cat.controls.subFunction = initSection.append("input");
  cat.controls.subFunction.node().value = current.sub;

  //Webcharts versionSelect
  var versionSection = controlWrap
    .append("div")
    .attr("class", "control-section");
  versionSection.append("span").text("Webcharts Version:");
  cat.controls.libraryVersion = versionSection.append("input");
  cat.controls.libraryVersion.node().value = "master";

  //Choose a data file
  var dataSection = controlWrap.append("div").attr("class", "control-section");
  dataSection.append("span").text("Data:");
  cat.controls.dataFileSelect = dataSection.append("select");
  cat.controls.dataFileSelect
    .selectAll("option")
    .data(settings.dataFiles)
    .enter()
    .append("option")
    .text(function(d) {
      return d;
    });

  //Edit the settings
  var settingsSection = controlWrap
    .append("div")
    .attr("class", "control-section");
  settingsSection.append("span").text("Settings:");
  settingsSection.append("br");
  cat.controls.settingsInput = settingsSection
    .append("textarea")
    .attr("rows", 10)
    .style("width", "90%")
    .text("{}");
}
