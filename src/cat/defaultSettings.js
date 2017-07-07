const defaultSettings = {
  rootURL: "https://cdn.rawgit.com/RhoInc",
  renderers: [
    {
      name: "aeexplorer",
      main: "aeTable",
      sub: "createChart",
      css: "css/aeTable.css",
      schema: "settings-schema.json"
    },
    {
      name: "web-codebook",
      main: "webcodebook",
      sub: "createChart",
      css: "css/webcodebook.css",
      schema: null
    },
    {
      name: "webCharts",
      main: "webCharts",
      sub: "createChart",
      css: "css/webcharts.css",
      schema: null
    },
    {
      name: "aetimelines",
      main: "aeTimelines",
      sub: null,
      css: null,
      schema: null
    },
    {
      name: "safety-histogram",
      main: "safetyHistogram",
      sub: null,
      css: null,
      schema: null
    },
    {
      name: "safety-outlier-explorer",
      main: "safetyOutlierExplorer",
      sub: null,
      css: null,
      schema: null
    },
    {
      name: "safety-results-over-time",
      main: "safetyResultsOverTime",
      sub: null,
      css: null,
      schema: null
    },
    {
      name: "safety-shift-plot",
      main: "safetyShiftPlot",
      sub: null,
      css: null,
      schema: null
    },
    {
      name: "query-overview",
      main: "queryOverview",
      sub: null,
      css: null,
      schema: null
    }
  ],
  dataURL: "https://rhoinc.github.io/viz-library/data/",
  dataFiles: [
    "safetyData-queries/ADAE.csv",
    "safetyData-queries/ADBDS.csv",
    "safetyData/ADAE.csv",
    "safetyData/ADBDS.csv",
    "safetyData/AE.csv",
    "safetyData/DM.csv",
    "safetyData/LB.csv",
    "queries/queries.csv",
    "cars.csv",
    "climate_data.csv",
    "discrete_score.csv",
    "elements.csv",
    "ChickWeight.csv"
  ]
};

export default defaultSettings;
