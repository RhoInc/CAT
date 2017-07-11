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

      //update the chart type configuration to the defaults for the selected renderer
      cat.controls.mainFunction.node().value = cat.current.main;
      cat.controls.subFunction.node().value = cat.current.sub;
      cat.controls.schema.node().value = cat.current.schema;

      //Re-initialize the chart config section
      cat.settings.set(cat);
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
    var settingsHeading = settingsSection.append("h3").html("4. Customize the Chart ");
    cat.controls.settingsRefresh = settingsHeading.append("span").html("&#x21bb;").on("click", function () {
      cat.settings.set(cat);
    });

    settingsSection.append("span").text("Settings: ");

    //////////////////////////////////////
    //initialize the config status icon
    //////////////////////////////////////
    cat.controls.settingsStatus = settingsSection.append("div").style("font-size", "1.5em").style("float", "right").style("cursor", "pointer");
    settingsSection.append("br");

    //////////////////////////////////////////////////////////////////////
    //radio buttons to toggle between "text" and "form" based settings
    /////////////////////////////////////////////////////////////////////
    cat.controls.settingsTypeText = settingsSection.append("input").attr("class", "radio").property("type", "radio").property("name", "settingsType").property("value", "text");
    settingsSection.append("span").text("text");
    cat.controls.settingsTypeForm = settingsSection.append("input").attr("class", "radio").property("type", "radio").property("name", "settingsType").property("value", "form");
    settingsSection.append("span").text("form");
    cat.controls.settingsType = settingsSection.selectAll('input[type="radio"]');

    cat.controls.settingsType.on("change", function (d) {
      cat.settings.sync(cat); //first sync the current settings to both views

      //then update to the new view, and update controls.
      cat.current.settingsView = this.value; //
      if (cat.current.settingsView == "text") {
        cat.controls.settingsInput.classed("hidden", false);
        cat.controls.settingsForm.classed("hidden", true);
      } else if (cat.current.settingsView == "form") {
        cat.controls.settingsInput.classed("hidden", true);
        cat.controls.settingsForm.classed("hidden", false);
      }
    });
    settingsSection.append("br");

    //////////////////////////////////////////////////////////////////////
    //text input section
    /////////////////////////////////////////////////////////////////////
    cat.controls.settingsInput = settingsSection.append("textarea").attr("rows", 10).style("width", "90%").text("{}");

    //////////////////////////////////////////////////////////////////////
    //wrapper for the form
    /////////////////////////////////////////////////////////////////////
    cat.controls.settingsForm = settingsSection.append("div").attr("class", "settingsForm").append("form");

    //set the text/form settings for the first renderer
    cat.settings.set(cat);
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
      cat.settings.sync(cat);
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

    // minimize controls - for later?
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
    var formLayout = [{
      type: "actions",
      items: [{
        type: "submit",
        title: "Submit"
      }]
    }, "*"];

    d3.select(".settingsForm form").selectAll("*").remove();
    var myForm = $(".settingsForm form").jsonForm({
      schema: cat.current.schemaObj,
      value: obj,
      form: formLayout,
      onSubmit: function onSubmit(errors, values) {
        if (errors) {
          cat.settings.setStatus(cat, "invalid");
          cat.current.config = values;
          cat.controls.settingsInput.node().value = JSON.stringify(cat.current.config);
        } else {
          cat.settings.setStatus(cat, "valid");
          cat.current.config = values;
          cat.controls.settingsInput.node().value = JSON.stringify(cat.current.config);
        }
      }
    });
    //handle submission with the "render chart" button
    d3.select(".settingsForm form .form-actions input").remove();
    //format the form a little bit so that we can dodge bootstrap
    d3.selectAll("i.icon-plus-sign").text("+");
    d3.selectAll("i.icon-minus-sign").text("-");
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

  function validateSchema(cat) {
    //  var Ajv = require('ajv');
    //  var ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
    //  var validate = ajv.compile(cat.);
    //  console.log(validate)
    return true;
  }

  function set(cat) {
    // load the schema (if any) and see if it is validate
    var version = cat.controls.versionSelect.node().value;
    var schemaPath = cat.config.rootURL + "/" + cat.current.name + "/" + version + "/" + cat.current.schema;
    var testPath = "../aeexplorer/settings-schema.json";
    d3.json(schemaPath, function (error, schemaObj) {
      //d3.json(testPath, function(error, schemaObj) {
      if (error) {
        console.log("No schema loaded.");
        cat.current.hasValidSchema = false;
        cat.current.settingsView = "text";
        cat.current.schemaObj = null;
        cat.settings.setStatus(cat, "no schema");
      } else {
        // attempt to validate the schema
        console.log("Schema found ...");
        cat.current.hasValidSchema = validateSchema(schemaObj);
        cat.current.settingsView = cat.current.hasValidSchema ? "form" : "text";
        cat.current.schemaObj = cat.current.hasValidSchema ? schemaObj : null;
        cat.settings.setStatus(cat, cat.current.hasValidSchema ? "unknown" : "no schema");
      }
      console.log(cat.current);
      //set the radio buttons
      cat.controls.settingsTypeText.property("checked", cat.current.settingsView == "text");

      cat.controls.settingsTypeForm.property("checked", cat.current.settingsView == "form").property("disabled", !cat.current.hasValidSchema);

      // Show/Hide sections
      console.log(cat.current.settingsView);
      cat.controls.settingsInput.classed("hidden", cat.current.settingsView != "text");
      cat.controls.settingsForm.classed("hidden", cat.current.settingsView != "form");

      if (cat.current.hasValidSchema) {
        console.log("... and it is valid. Making a nice form.");
        makeForm(cat);
      }
    });
  }

  function sync(cat) {
    // set current config
    if (cat.current.settingsView == "text") {
      cat.current.config = JSON.parse(cat.controls.settingsInput.node().value);
      if (cat.current.hasValidSchema) {
        makeForm(cat, cat.current.config);
      }
    } else if (cat.current.settingsView == "form") {
      //this submits the form which:
      //- saves the current object
      //- updates the hidden text view
      $(".settingsForm form").trigger("submit");
    }
  }

  var settings = {
    set: set,
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