var cat = function () {
  'use strict';

  function init() {

    //layout the cat
    this.wrap = d3.select(this.element).append("div").attr('class', 'cat-wrap');
    this.layout(this);

    //initialize the settings
    this.setDefaults(this);

    //create the controls
    this.controls.init(this);
  }

  function layout(cat) {
    cat.controls.wrap = cat.wrap.append("div").attr("class", "cat-controls");
    cat.chartWrap = cat.wrap.append("div").attr("class", "cat-chart");
    cat.dataWrap = cat.wrap.append("div").attr("class", "cat-data");
  }

  function loadRenderer(src, callback, cat) {
    var s, r, t;
    r = false;
    s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = src;
    s.onload = s.onreadystatechange = function () {
      if (!r && (!this.readyState || this.readyState == 'complete')) {
        r = true;
        callback(cat);
      }
    };
    t = document.getElementsByTagName('script')[0];
    t.parentNode.insertBefore(s, t);
  }

  function renderChart(cat) {
    var rendererObj = cat.controls.rendererSelect.selectAll("option:checked").data()[0];
    cat.chartWrap.selectAll("*").remove();

    //render the new chart with the current settings
    var dataFile = cat.controls.dataFileSelect.node().value;
    var dataFilePath = cat.config.dataURL + dataFile;
    var chartSettings = JSON.parse(cat.controls.settingsInput.node().value);
    console.log('  Settings: ' + cat.controls.settingsInput.node().value.replace(/\t/g, ' ').replace(/\n| +(?= )/g, ''));
    console.log('  Data: ' + dataFile);
    d3.csv(dataFilePath, function (data) {
      console.log(rendererObj);
      if (rendererObj.sub) {
        console.log("sub");
        var myChart = window[rendererObj.main][rendererObj.sub]('.cat-chart', chartSettings);
      } else {
        console.log("nosub");
        var myChart = window[rendererObj.main]('.cat-chart', chartSettings);
      }
      console.log(data);
      console.log(cat);
      console.log(myChart);
      myChart.init(data);
    });
  }

  function init$1(cat) {
    var settings = cat.config;

    //submit
    cat.controls.submitButton = cat.controls.wrap.append("button").attr("class", "submit").text("Render Chart");

    //Choose a renderer
    var rendererWrap = cat.controls.wrap.append("div").attr("class", "control-wrap");
    rendererWrap.append("span").text("Renderer:");
    cat.controls.rendererSelect = rendererWrap.append("select");
    cat.controls.rendererSelect.selectAll("option").data(settings.renderers).enter().append("option").text(function (d) {
      return d.name;
    });

    //Choose a version
    rendererWrap.append("span").text("  Version:");
    cat.controls.versionSelect = rendererWrap.append("input");
    cat.controls.versionSelect.node().value = "master";

    //Choose a data file
    var datafileWrap = cat.controls.wrap.append("div").attr("class", "control-wrap");

    datafileWrap.append("span").text("Data:");
    cat.controls.dataFileSelect = datafileWrap.append("select");
    cat.controls.dataFileSelect.selectAll("option").data(settings.dataFiles).enter().append("option").text(function (d) {
      return d;
    });

    //Edit the settings
    var settingsWrap = cat.controls.wrap.append("div").attr("class", "control-wrap");
    settingsWrap.append("span").text("Settings:");
    settingsWrap.append("br");
    cat.controls.settingsInput = settingsWrap.append("textarea").attr("rows", 10).attr("cols", 50).text("{}");

    cat.controls.submitButton.on("click", function () {
      var rendererObj = cat.controls.rendererSelect.selectAll("option:checked").data()[0];
      var version = cat.controls.versionSelect.node().value;
      var rendererPath = cat.config.rootURL + "/" + rendererObj.name + "/" + version + "/build/" + rendererObj.main + ".js";

      console.clear();
      console.log('Renderer: ' + rendererObj.name);
      console.log('  Version: ' + version);
      console.log('  URL: ' + rendererPath);

      loadRenderer(rendererPath, renderChart, cat);
    });
  }

  const controls = {
    init: init$1
  };

  const defaultSettings = {
    rootURL: "https://cdn.rawgit.com/RhoInc",
    renderers: [{ name: "web-codebook", main: "webcodebook", sub: "createChart", css: "" }, { name: "webcharts", main: "webcharts", sub: "createChart", css: "" }, { name: "aeexplorer", main: "aeTable", sub: "createChart", css: "" }, { name: "aetimelines", main: "aeTimelines", sub: null, css: "" }, { name: "safety-histogram", main: "safetyHistogram", sub: null, css: "" }, { name: "safety-outlier-explorer", main: "safetyOutlierExplorer", sub: null, css: "" }, { name: "safety-results-over-time", main: "safetyResultsOverTime", sub: null, css: "" }, { name: "safety-shift-plot", main: "safetyShiftPlot", sub: null, css: "" }],
    dataURL: "https://rhoinc.github.io/viz-library/examples/0000-sample-data/",
    dataFiles: ["safetyData-queries/ADAE.csv", "safetyData-queries/ADBDS.csv", "safetyData/ADAE.csv", "safetyData/ADBDS.csv", "safetyData/AE.csv", "safetyData/DM.csv", "safetyData/LB.csv"]
  };

  function setDefaults(cat) {
    cat.config = defaultSettings; // just ignore the user settings for the moment. Will set up merge later.
  }

  function createCat(element = 'body', config) {
    let cat = { element: element,
      config: config,
      init: init,
      layout: layout,
      controls: controls,
      setDefaults: setDefaults
    };

    return cat;
  }

  var index = {
    createCat: createCat
  };

  return index;
}();
