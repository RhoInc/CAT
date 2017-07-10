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

  function initRendererSelect(cat) {
    var rendererSection = cat.controls.wrap.append("div").attr("class", "control-section section1");

    rendererSection.append("h3").text("1. Choose a Chart Type");
    cat.controls.rendererSelect = rendererSection.append("select");
    cat.controls.rendererSelect.selectAll("option").data(cat.config.renderers).enter().append("option").text(function (d) {
      return d.name;
    });

    cat.controls.rendererSelect.on("change", function (d) {
      cat.current = d3.select(this).select("option:checked").data()[0];
      cat.controls.mainFunction.node().value = cat.current.main;
      cat.controls.subFunction.node().value = cat.current.sub;
      cat.controls.schema.node().value = cat.current.schema;

      cat.controls.settingsType.filter(function (d) {
        return this.value == "form";
      }).property("disabled", cat.current.schema ? false : "disabled");
    });
  }

  function initRendererConfig(cat) {
    var versionSection = cat.controls.wrap.append("div").attr("class", "control-section section2");

    versionSection.append("h3").text("2. Configure the Chart Type");
    versionSection.append("span").text("Version: ");
    cat.controls.versionSelect = versionSection.append("input");
    cat.controls.versionSelect.node().value = "master";
    versionSection.append("br");

    versionSection.append("a").text("More Options").style("text-decoration", "underline").style("color", "blue").style("cursor", "pointer").on("click", function () {
      d3.select(this).remove();
      versionSection.selectAll("*").classed("hidden", false);
    });

    //specify the code to create the chart
    versionSection.append("span").text(" Init: ").classed("hidden", true);
    cat.controls.mainFunction = versionSection.append("input").classed("hidden", true);
    cat.controls.mainFunction.node().value = cat.current.main;
    versionSection.append("span").text(".").classed("hidden", true);
    cat.controls.subFunction = versionSection.append("input").classed("hidden", true);
    cat.controls.subFunction.node().value = cat.current.sub;
    versionSection.append("br").classed("hidden", true);
    //Webcharts versionSelect
    versionSection.append("span").text("Webcharts Version: ").classed("hidden", true);
    cat.controls.libraryVersion = versionSection.append("input").classed("hidden", true);
    cat.controls.libraryVersion.node().value = "master";
    versionSection.append("br").classed("hidden", true);

    versionSection.append("span").text("Schema: ").classed("hidden", true);
    cat.controls.schema = versionSection.append("input").classed("hidden", true);
    cat.controls.schema.node().value = cat.current.schema;
    versionSection.append("br").classed("hidden", true);
  }

  function initDataSelect(cat) {
    var dataSection = cat.controls.wrap.append("div").attr("class", "control-section");
    dataSection.append("h3").text("3. Choose a data Set");

    cat.controls.dataFileSelect = dataSection.append("select");
    cat.controls.dataFileSelect.selectAll("option").data(cat.config.dataFiles).enter().append("option").text(function (d) {
      return d;
    });
  }

  function initChartConfig(cat) {
    var settingsSection = cat.controls.wrap.append("div").attr("class", "control-section");
    settingsSection.append("h3").text("4. Customize the Chart");

    settingsSection.append("span").text("Settings: ");

    cat.controls.settingsStatus = settingsSection.append("div").style("font-size", "1.5em").style("float", "right").style("cursor", "pointer");

    cat.settings.setStatus(cat, "no schema");

    settingsSection.append("br");

    settingsSection.append("input").attr("class", "radio").property("type", "radio").property("name", "settingsType").property("value", "text").property("checked", !cat.current.schema);
    settingsSection.append("span").text("text");

    settingsSection.append("input").attr("class", "radio").property("type", "radio").property("name", "settingsType").property("value", "form").property("checked", cat.current.schema).property("disabled", !cat.current.schema);
    settingsSection.append("span").text("form");

    cat.controls.settingsType = settingsSection.selectAll('input[type="radio"]');

    cat.controls.settingsType.on("change", function (d) {
      cat.settings.sync(cat);
      if (this.value == "text") {
        cat.controls.settingsInput.classed("hidden", false);
        cat.controls.settingsForm.classed("hidden", true);
      } else if (this.value == "form") {
        cat.controls.settingsInput.classed("hidden", true);
        cat.controls.settingsForm.classed("hidden", false);
      }
    });

    settingsSection.append("br");

    cat.controls.settingsInput = settingsSection.append("textarea").attr("rows", 10).style("width", "90%").text("{}").classed("hidden", cat.current.schema);

    cat.controls.settingsForm = settingsSection.append("div").attr("class", "settingsForm").append("form").classed("hidden", !cat.current.schema);

    if (cat.current.schema) {
      cat.settings.setStatus(cat, "unknown");
      cat.settings.makeForm(cat, null);
    }
  }

  function renderChart(cat) {
    var rendererObj = cat.controls.rendererSelect.selectAll("option:checked").data()[0];
    cat.chartWrap.selectAll("*").remove();
    cat.settings.sync(cat);
    console.log(cat.current);
    //render the new chart with the current settings
    var dataFile = cat.controls.dataFileSelect.node().value;
    var dataFilePath = cat.config.dataURL + dataFile;
    d3.csv(dataFilePath, function (data) {
      if (cat.current.sub) {
        var myChart = window[cat.current.main][cat.current.sub](".cat-chart", cat.current.config);
      } else {
        var myChart = window[cat.current.main](".cat-chart", cat.current.config);
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

  function initSubmit(cat) {
    var submitSection = cat.controls.wrap.append("div").attr("class", "control-section");

    cat.controls.submitButton = submitSection.append("button").attr("class", "submit").text("Render Chart").on("click", function () {
      loadLibrary(cat);
    });
  }

  function init$1(cat) {
    cat.current = cat.config.renderers[0];
    cat.controls.wrap.append("h2").text("Charting Application Tester 😼");
    initSubmit(cat);
    initRendererSelect(cat);
    initRendererConfig(cat);
    initDataSelect(cat);
    initChartConfig(cat);

    // minimize controls
    /*
    cat.controls.minimize = controlWrap
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
    */
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

  function makeForm(cat, obj) {
    var version = cat.controls.versionSelect.node().value;

    var formLayout = [{
      type: "actions",
      items: [{
        type: "submit",
        title: "Submit"
      }]
    }, "*"];

    var schemaPath = cat.config.rootURL + "/" + cat.current.name + "/" + version + "/" + cat.current.schema;

    var testPath = "../aeexplorer/settings-schema.json";
    //d3.json(schemaPath, function(error, schemaObj) {
    d3.select(".settingsForm form").selectAll("*").remove();
    d3.json(testPath, function (error, schemaObj) {
      var myForm = $(".settingsForm form").jsonForm({
        schema: schemaObj,
        value: obj,
        form: formLayout,
        onSubmit: function onSubmit(errors, values) {
          if (errors) {
            cat.settings.setStatus(cat, "invalid");
            cat.controls.settingsInput.node().value = JSON.stringify(cat.current.config);
          } else {
            cat.settings.setStatus(cat, "valid");
            cat.current.config = values;
            cat.controls.settingsInput.node().value = JSON.stringify(cat.current.config);
          }
        }
      });
      //format the form a little bit so that we can dodge bootstrap
      d3.select(".settingsForm form .form-actions input").text("Validate Settings").property("value", "Validate Settings");
      d3.selectAll("i.icon-plus-sign").append("span").text("+");
      d3.selectAll("i.icon-minus-sign").append("span").text("-");

      console.log(myForm);
    });
  }

  function reset(cat) {
    //reset the current settings object to the default
    //select the text settings view
    //delete the form view
  }

  function sync(cat) {
    var settingType = cat.controls.settingsType.filter(function (d) {
      return d3.select(this).property("checked");
    }).node().value;

    // set current config
    if (settingType == "text") {
      cat.current.config = JSON.parse(cat.controls.settingsInput.node().value);
      cat.settings.makeForm(cat, cat.current.config);
    } else if (settingType == "form") {
      //this submits the form (thus saving the most recent object)
      $(".settingsForm form").trigger("submit");
    }
  }

  function setStatus(cat, statusVal) {
    var statusOptions = [{
      key: "valid",
      symbol: "&#x2714;",
      color: "green",
      details: "Settings match the current schema. Click 'Render Chart' to draw the chart."
    }, {
      key: "invalid",
      symbol: "&#x2718;",
      color: "red",
      details: "Settings do not match the current schema. You can still click 'Render Chart' to try to draw the chart, but it might not work as expected."
    }, {
      key: "unknown",
      symbol: "?",
      color: "blue",
      details: "You've loaded a schema, but the setting have changed. Click 'Validate Settings' to see if they're valid or you can click 'Render Chart' and see what happens."
    }, {
      key: "no schema",
      symbol: "NA",
      color: "#999",
      details: "No Schema loaded. Cannot validate the current settings. You can click 'Render Chart' and see what happens."
    }];

    var myStatus = statusOptions.filter(function (d) {
      return d.key == statusVal;
    })[0];

    cat.controls.settingsStatus.html(myStatus.symbol).style("color", myStatus.color).attr("title", myStatus.details);
  }

  var settings = {
    makeForm: makeForm,
    reset: reset,
    sync: sync,
    setStatus: setStatus
  };

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
      settings: settings
    };

    return cat;
  }

  var index = {
    createCat: createCat
  };

  return index;

}));