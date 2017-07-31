const defaultSettings = {
  rootURL: "https://cdn.rawgit.com/RhoInc",
  renderers: [
    {
      name: "aeexplorer",
      main: "aeTable",
      sub: "createChart",
      css: "css/aeTable.css",
      schema: "settings-schema.json",
      default: "safetyData-queries/ADAE.csv"
    },
    {
      name: "web-codebook",
      main: "webcodebook",
      sub: "createChart",
      css: "css/webcodebook.css",
      schema: null,
      defaultData: "safetyData-queries/ADAE.csv"
    },
    {
      name: "aetimelines",
      main: "aeTimelines",
      sub: null,
      css: null,
      schema: null,
      defaultData: "safetyData-queries/ADAE.csv"
    },
    {
      name: "safety-histogram",
      main: "safetyHistogram",
      sub: null,
      css: null,
      schema: null,
      defaultData: "safetyData-queries/ADBDS.csv"
    },
    {
      name: "safety-outlier-explorer",
      main: "safetyOutlierExplorer",
      sub: null,
      css: null,
      schema: null,
      defaultData: "safetyData-queries/ADBDS.csv"
    },
    {
      name: "safety-results-over-time",
      main: "safetyResultsOverTime",
      sub: null,
      css: null,
      schema: null,
      defaultData: "safetyData-queries/ADBDS.csv"
    },
    {
      name: "safety-shift-plot",
      main: "safetyShiftPlot",
      sub: null,
      css: null,
      schema: null,
      defaultData: "safetyData-queries/ADBDS.csv"
    },
    {
      name: "query-overview",
      main: "queryOverview",
      sub: null,
      css: null,
      schema: null,
      defaultData: "queries/queries.csv"
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
