var myCatConfig = {
  useServer: false,
  rootURL: 'https://cdn.rawgit.com/RhoInc',
  dataURL: 'https://cdn.rawgit.com/RhoInc/viz-library/master/data/',
  renderers: [
    {
      name: 'web-codebook',
      main: 'webcodebook',
      sub: 'createChart',
      css: 'css/webcodebook.css',
      schema: 'settings-schema.json',
      defaultData: 'safetyData/ADAE.csv'
    },
    {
      name: 'aeexplorer',
      main: 'aeTable',
      sub: 'createChart',
      css: 'css/aeTable.css',
      schema: 'settings-schema.json',
      defaultData: 'safetyData/ADAE.csv'
    },
    {
      name: 'aetimelines',
      main: 'aeTimelines',
      sub: null,
      css: null,
      schema: 'settings-schema.json',
      defaultData: 'safetyData/ADAE.csv'
    },
    {
      name: 'safety-histogram',
      main: 'safetyHistogram',
      sub: null,
      css: null,
      schema: 'settings-schema.json',
      defaultData: 'safetyData/ADBDS.csv'
    },
    {
      name: 'safety-outlier-explorer',
      main: 'safetyOutlierExplorer',
      sub: null,
      css: null,
      schema: 'settings-schema.json',
      defaultData: 'safetyData/ADBDS.csv'
    },
    {
      name: 'safety-results-over-time',
      main: 'safetyResultsOverTime',
      sub: null,
      css: null,
      schema: 'settings-schema.json',
      defaultData: 'safetyData/ADBDS.csv'
    },
    {
      name: 'paneled-outlier-explorer',
      main: 'paneledOutlierExplorer',
      sub: null,
      css: null,
      schema: 'settings-schema.json',
      defaultData: 'safetyData/ADBDS.csv'
    },
    {
      name: 'safety-shift-plot',
      main: 'safetyShiftPlot',
      sub: null,
      css: null,
      schema: 'settings-schema.json',
      defaultData: 'safetyData/ADBDS.csv'
    },
    {
      name: 'clinical-timelines',
      main: 'clinicalTimelines',
      sub: null,
      css: null,
      schema: 'settings-schema.json',
      defaultData: 'safetyData/ADTIMELINES.csv'
    },
    {
      name: 'query-overview',
      main: 'queryOverview',
      sub: null,
      css: null,
      schema: 'settings-schema.json',
      defaultData: 'queries/queries.csv'
    },
    {
      name: 'crf-heat-map',
      main: 'crfHeatMap',
      sub: null,
      css: null,
      schema: 'settings-schema.json',
      defaultData: 'dataCleaning/dmc_DataPage.csv'
    }
  ]
};

myCatConfig.dataFiles = dataFiles.map(function(m){
    return m.rel_path.slice(7)
});

var myCat = cat.createCat('body',myCatConfig)

myCat.init()
