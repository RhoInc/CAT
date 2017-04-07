const defaultSettings = {
  rootURL:"https://cdn.rawgit.com/RhoInc",
  renderers:[
    {name:"web-codebook",main:"webcodebook",sub:"createChart",css:""},
    {name:"webcharts",main:"webcharts",sub:"createChart",css:""},
    {name:"aeexplorer",main:"aeTable",sub:"createChart",css:""},
    {name:"aetimelines",main:"aeTimelines",sub:null,css:""},
    {name:"safety-histogram",main:"safetyHistogram",sub:null,css:""},
    {name:"safety-outlier-explorer",main:"safetyOutlierExplorer",sub:null,css:""},
    {name:"safety-results-over-time",main:"safetyResultsOverTime",sub:null,css:""},
    {name:"safety-shift-plot",main:"safetyShiftPlot",sub:null,css:""}
  ],
  dataURL:"https://rhoinc.github.io/viz-library/examples/0000-sample-data/",
  dataFiles:[
    "safetyData-queries/ADAE.csv",
    "safetyData-queries/ADBDS.csv",
    "safetyData/ADAE.csv",
    "safetyData/ADBDS.csv",
    "safetyData/AE.csv",
    "safetyData/DM.csv",
    "safetyData/LB.csv"
  ]
}

export default defaultSettings;