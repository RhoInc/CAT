import { loadLibrary } from "../loadLibrary";

export function init(cat) {
  var settings = cat.config;
  cat.current = settings.renderers[0];
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
  rendererSection.append("span").text("Renderer: ");
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
    cat.current = d3.select(this).select("option:checked").data()[0];
    cat.controls.mainFunction.node().value = cat.current.main;
    cat.controls.subFunction.node().value = cat.current.sub;
    cat.controls.schema.node().value = cat.current.schema;

    cat.controls.settingsType
      .filter(function(d) {
        console.log(this.value);
        return this.value == "form";
      })
      .property("disabled", cat.current.schema ? false : "disabled");
  });

  //Choose a version
  var versionSection = controlWrap
    .append("div")
    .attr("class", "control-section");
  versionSection.append("span").text("  Version: ");
  cat.controls.versionSelect = versionSection.append("input");
  cat.controls.versionSelect.node().value = "master";

  //specify the code to create the chart
  var initSection = controlWrap.append("div").attr("class", "control-section");
  initSection.append("span").text(" Init: ");
  cat.controls.mainFunction = initSection.append("input");
  cat.controls.mainFunction.node().value = cat.current.main;
  initSection.append("span").text(".");
  cat.controls.subFunction = initSection.append("input");
  cat.controls.subFunction.node().value = cat.current.sub;

  //Webcharts versionSelect
  var versionSection = controlWrap
    .append("div")
    .attr("class", "control-section");
  versionSection.append("span").text("Webcharts Version: ");
  cat.controls.libraryVersion = versionSection.append("input");
  cat.controls.libraryVersion.node().value = "master";

  //specify a schema
  var schemaSection = controlWrap
    .append("div")
    .attr("class", "control-section");

  schemaSection.append("span").text("Schema: ");
  cat.controls.schema = schemaSection.append("input");
  cat.controls.schema.node().value = cat.current.schema;

  //Edit the settings
  var settingsSection = controlWrap
    .append("div")
    .attr("class", "control-section");

  settingsSection.append("span").text("Settings: ");
  settingsSection.append("br");

  settingsSection
    .append("input")
    .attr("class", "radio")
    .property("type", "radio")
    .property("name", "settingsType")
    .property("value", "text")
    .property("checked", "checked");
  settingsSection.append("span").text("text");

  settingsSection
    .append("input")
    .attr("class", "radio")
    .property("type", "radio")
    .property("name", "settingsType")
    .property("value", "form")
    .property("disabled", cat.current.schema ? null : "disabled");
  settingsSection.append("span").text("form");

  cat.controls.settingsType = settingsSection.selectAll('input[type="radio"]');

  cat.controls.settingsType.on("change", function(d) {
    console.log(this.value);
    if (this.value == "text") {
      cat.controls.settingsInput.classed("hidden", false);
      cat.controls.settingsForm.classed("hidden", true);
    } else if (this.value == "form") {
      cat.controls.settingsInput.classed("hidden", true);
      cat.controls.settingsForm.classed("hidden", false);
      cat.makeSettingsForm(cat);
    }
  });

  settingsSection.append("br");

  cat.controls.settingsInput = settingsSection
    .append("textarea")
    .attr("rows", 10)
    .style("width", "90%")
    .text("{}");

  cat.controls.settingsForm = settingsSection
    .append("div")
    .attr("class", "settingsForm")
    .append("form")
    .classed("hidden", true);

  settingsSection.append("span").text("Settings Status: ");
  cat.controls.settingsStatus = settingsSection
    .append("span")
    .html("&#63;")
    .style("color", "#888");

  //Choose a data file
  var dataSection = controlWrap.append("div").attr("class", "control-section");
  dataSection.append("span").text("Data: ");
  cat.controls.dataFileSelect = dataSection.append("select");
  cat.controls.dataFileSelect
    .selectAll("option")
    .data(settings.dataFiles)
    .enter()
    .append("option")
    .text(function(d) {
      return d;
    });
}
