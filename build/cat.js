(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.cat = factory());
}(this, function () { 'use strict';

  function init() {
    //layout the cat
    this.wrap = d3.select(this.element).append("div").attr("class", "cat-wrap");
    this.layout(this);

    //initialize the settings
    this.setDefaults(this);

    //create the controls
    this.controls.init(this);
  }

  function layout(cat) {
    cat.controls.wrap = cat.wrap.append("div").attr("class", "cat-controls section");
    cat.chartWrap = cat.wrap.append("div").attr("class", "cat-chart section");
    cat.dataWrap = cat.wrap.append("div").attr("class", "cat-data footer");
  }

  function renderChart(cat) {
    var rendererObj = cat.controls.rendererSelect.selectAll("option:checked").data()[0];
    cat.chartWrap.selectAll("*").remove();

    //render the new chart with the current settings
    var dataFile = cat.controls.dataFileSelect.node().value;
    var dataFilePath = cat.config.dataURL + dataFile;
    var chartSettings = JSON.parse(cat.controls.settingsInput.node().value);
    console.log("  Settings: " + cat.controls.settingsInput.node().value.replace(/\t/g, " ").replace(/\n| +(?= )/g, ""));
    console.log("  Data: " + dataFile);
    d3.csv(dataFilePath, function (data) {
      console.log(rendererObj);
      var mainFunction = cat.controls.mainFunction.node().value;
      if (rendererObj.sub) {
        console.log("sub");
        var subFunction = cat.controls.subFunction.node().value;
        var myChart = window[mainFunction][subFunction](".cat-chart", chartSettings);
      } else {
        console.log("nosub");
        var myChart = window[mainFunction](".cat-chart", chartSettings);
      }
      myChart.init(data);
    });
  }

  function loadRenderer(cat) {
    var rendererObj = cat.controls.rendererSelect.selectAll("option:checked").data()[0];
    var version = cat.controls.versionSelect.node().value;
    var rendererPath = cat.config.rootURL + "/" + rendererObj.name + "/" + version + "/build/" + rendererObj.main + ".js";

    if (rendererObj.css) {
      var link = document.createElement("link");
      link.href = cat.config.rootURL + "/" + rendererObj.name + "/" + version + "/" + rendererObj.css;
      link.type = "text/css";
      link.rel = "stylesheet";
      document.getElementsByTagName("head")[0].appendChild(link);
    }

    var scriptReady = false;
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = rendererPath;
    script.onload = script.onreadystatechange = function () {
      if (!scriptReady && (!this.readyState || this.readyState == "complete")) {
        scriptReady = true;
        renderChart(cat);
      }
    };
    var tag = document.getElementsByTagName("script")[0];
    tag.parentNode.insertBefore(script, tag);
  }

  function loadLibrary(cat) {
    var version = cat.controls.libraryVersion.node().value;
    var rendererPath = cat.config.rootURL + "/" + "webcharts" + //hardcode to webcharts for now - could generalize later
    "/" + version + "/build/" + "webcharts" + ".js";

    var link = document.createElement("link");
    link.href = cat.config.rootURL + "/" + "webcharts" + "/" + version + "/" + "css" + "/" + "webcharts.css";
    link.type = "text/css";
    link.rel = "stylesheet";
    document.getElementsByTagName("head")[0].appendChild(link);

    var scriptReady = false;
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = rendererPath;
    script.onload = script.onreadystatechange = function () {
      if (!scriptReady && (!this.readyState || this.readyState == "complete")) {
        scriptReady = true;
        loadRenderer(cat);
      }
    };
    var tag = document.getElementsByTagName("script")[0];
    tag.parentNode.insertBefore(script, tag);
  }

  function init$1(cat) {
    var settings = cat.config;
    cat.current = settings.renderers[0];
    var controlWrap = cat.controls.wrap;

    // minimize controls
    var minimize = controlWrap.append("div").attr("class", "minimize").text("<<").style("float", "left").on("click", function () {
      cat.controls.wrap.classed("hidden", true);
      cat.wrap.insert("div", ":first-child").attr("class", "maximize").text(">>").on("click", function () {
        cat.controls.wrap.classed("hidden", false);
        d3.select(this).remove();
      });
    });

    //submit
    var submitSection = controlWrap.append("div").attr("class", "control-section");
    cat.controls.submitButton = submitSection.append("button").attr("class", "submit").text("Render Chart").on("click", function () {
      loadLibrary(cat);
    });

    //Choose a renderer
    var rendererSection = controlWrap.append("div").attr("class", "control-section");
    rendererSection.append("span").text("Renderer: ");
    cat.controls.rendererSelect = rendererSection.append("select");
    cat.controls.rendererSelect.selectAll("option").data(settings.renderers).enter().append("option").text(function (d) {
      return d.name;
    });

    cat.controls.rendererSelect.on("change", function (d) {
      cat.current = d3.select(this).select("option:checked").data()[0];
      cat.controls.mainFunction.node().value = cat.current.main;
      cat.controls.subFunction.node().value = cat.current.sub;
      cat.controls.schema.node().value = cat.current.schema;

      cat.controls.settingsType.filter(function (d) {
        console.log(this.value);
        return this.value == "form";
      }).property("disabled", cat.current.schema ? false : "disabled");
    });

    //Choose a version
    var versionSection = controlWrap.append("div").attr("class", "control-section");
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
    var versionSection = controlWrap.append("div").attr("class", "control-section");
    versionSection.append("span").text("Webcharts Version: ");
    cat.controls.libraryVersion = versionSection.append("input");
    cat.controls.libraryVersion.node().value = "master";

    //specify a schema
    var schemaSection = controlWrap.append("div").attr("class", "control-section");

    schemaSection.append("span").text("Schema: ");
    cat.controls.schema = schemaSection.append("input");
    cat.controls.schema.node().value = cat.current.schema;

    //Edit the settings
    var settingsSection = controlWrap.append("div").attr("class", "control-section");

    settingsSection.append("span").text("Settings: ");
    settingsSection.append("br");

    settingsSection.append("input").attr("class", "radio").property("type", "radio").property("name", "settingsType").property("value", "text").property("checked", "checked");
    settingsSection.append("span").text("text");

    settingsSection.append("input").attr("class", "radio").property("type", "radio").property("name", "settingsType").property("value", "form").property("disabled", cat.current.schema ? null : "disabled");
    settingsSection.append("span").text("form");

    cat.controls.settingsType = settingsSection.selectAll('input[type="radio"]');

    cat.controls.settingsType.on("change", function (d) {
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

    cat.controls.settingsInput = settingsSection.append("textarea").attr("rows", 10).style("width", "90%").text("{}");

    cat.controls.settingsForm = settingsSection.append("div").attr("class", "settingsForm").append("form").classed("hidden", true);

    settingsSection.append("span").text("Settings Status: ");
    cat.controls.settingsStatus = settingsSection.append("span").html("&#63;").style("color", "#888");

    //Choose a data file
    var dataSection = controlWrap.append("div").attr("class", "control-section");
    dataSection.append("span").text("Data: ");
    cat.controls.dataFileSelect = dataSection.append("select");
    cat.controls.dataFileSelect.selectAll("option").data(settings.dataFiles).enter().append("option").text(function (d) {
      return d;
    });
  }

  var controls = {
    init: init$1
  };

  var defaultSettings = {
    rootURL: "https://cdn.rawgit.com/RhoInc",
    renderers: [{
      name: "aeexplorer",
      main: "aeTable",
      sub: "createChart",
      css: "css/aeTable.css",
      schema: "settings-schema.json"
    }, {
      name: "web-codebook",
      main: "webcodebook",
      sub: "createChart",
      css: "css/webcodebook.css",
      schema: null
    }, {
      name: "webCharts",
      main: "webCharts",
      sub: "createChart",
      css: "css/webcharts.css",
      schema: null
    }, {
      name: "aetimelines",
      main: "aeTimelines",
      sub: null,
      css: null,
      schema: null
    }, {
      name: "safety-histogram",
      main: "safetyHistogram",
      sub: null,
      css: null,
      schema: null
    }, {
      name: "safety-outlier-explorer",
      main: "safetyOutlierExplorer",
      sub: null,
      css: null,
      schema: null
    }, {
      name: "safety-results-over-time",
      main: "safetyResultsOverTime",
      sub: null,
      css: null,
      schema: null
    }, {
      name: "safety-shift-plot",
      main: "safetyShiftPlot",
      sub: null,
      css: null,
      schema: null
    }, {
      name: "query-overview",
      main: "queryOverview",
      sub: null,
      css: null,
      schema: null
    }],
    dataURL: "https://rhoinc.github.io/viz-library/data/",
    dataFiles: ["safetyData-queries/ADAE.csv", "safetyData-queries/ADBDS.csv", "safetyData/ADAE.csv", "safetyData/ADBDS.csv", "safetyData/AE.csv", "safetyData/DM.csv", "safetyData/LB.csv", "queries/queries.csv", "cars.csv", "climate_data.csv", "discrete_score.csv", "elements.csv", "ChickWeight.csv"]
  };

  function setDefaults(cat) {
    cat.config = defaultSettings; // just ignore the user settings for the moment. Will set up merge later.
  }

  function makeSettingsForm(cat) {
    console.log("settings form is coming atcha");

    var version = cat.controls.versionSelect.node().value;
    var schemaPath = cat.config.rootURL + "/" + cat.current.name + "/" + version + "/" + cat.current.schema;

    var testPath = "../aeexplorer/settings-schema.json";
    console.log(schemaPath);
    //d3.json(schemaPath, function(error, schemaObj) {
    d3.json(testPath, function (error, schemaObj) {
      console.log(schemaObj);
      $(".settingsForm form").jsonForm({
        schema: schemaObj,
        onSubmit: function onSubmit(errors, values) {
          console.log("clicked");
          if (errors) {
            console.log("Boo :(");
            console.log(errors);
          } else {
            console.log("yay :)");
            console.log(values);
          }
        }
      });
    });
  }

  function createCat() {
    var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "body";
    var config = arguments[1];

    var cat = {
      element: element,
      config: config,
      init: init,
      layout: layout,
      controls: controls,
      setDefaults: setDefaults,
      makeSettingsForm: makeSettingsForm
    };

    return cat;
  }

  var index = {
    createCat: createCat
  };

  return index;

}));