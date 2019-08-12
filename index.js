var myCatConfig = {
    useServer: false,
    rootURL: 'https://cdn.jsdelivr.net/gh/RhoInc',
    dataURL: 'https://raw.githubusercontent.com/RhoInc/data-library/master/data/',
    renderers: [
        {
            name: 'web-codebook',
            main: 'webcodebook',
            sub: 'createChart',
            css: 'css/webcodebook.css',
            schema: 'settings-schema.json',
            defaultData: 'miscellaneous/iris.csv'
        },

    /**-------------------------------------------------------------------------------------------\
      Safety Explorer Suite
    \-------------------------------------------------------------------------------------------**/

        /***--------------------------------------------------------------------------------------\
          Adverse Events
        \--------------------------------------------------------------------------------------***/

            {
                name: 'aeexplorer',
                main: 'aeTable',
                sub: 'createChart',
                css: 'css/aeTable.css',
                schema: 'settings-schema.json',
                defaultData: 'clinical-trials/adam/adae.csv'
            },
            {
                name: 'aetimelines',
                main: 'aeTimelines',
                sub: null,
                css: null,
                schema: 'settings-schema.json',
                defaultData: 'clinical-trials/adam/adae.csv'
            },

        /***--------------------------------------------------------------------------------------\
          Medical Signs
        \--------------------------------------------------------------------------------------***/

            {
                name: 'safety-histogram',
                main: 'safetyHistogram',
                sub: null,
                css: null,
                schema: 'settings-schema.json',
                defaultData: 'clinical-trials/renderer-specific/adbds.csv'
            },
            {
                name: 'safety-outlier-explorer',
                main: 'safetyOutlierExplorer',
                sub: null,
                css: null,
                schema: 'settings-schema.json',
                defaultData: 'clinical-trials/renderer-specific/adbds.csv'
            },
            {
                name: 'paneled-outlier-explorer',
                main: 'paneledOutlierExplorer',
                sub: null,
                css: null,
                schema: 'settings-schema.json',
                defaultData: 'clinical-trials/renderer-specific/adbds.csv'
            },
            {
                name: 'safety-results-over-time',
                main: 'safetyResultsOverTime',
                sub: null,
                css: null,
                schema: 'settings-schema.json',
                defaultData: 'clinical-trials/renderer-specific/adbds.csv'
            },
            {
                name: 'safety-shift-plot',
                main: 'safetyShiftPlot',
                sub: null,
                css: null,
                schema: 'settings-schema.json',
                defaultData: 'clinical-trials/renderer-specific/adbds.csv'
            },
            {
                name: 'hep-explorer',
                main: 'hepexplorer',
                sub: null,
                css: null,
                schema: 'settings-schema.json',
                defaultData: 'clinical-trials/renderer-specific/adbds.csv',
                rootURL: 'https://cdn.jsdelivr.net/gh/SafetyGraphics',
            },

    /**-------------------------------------------------------------------------------------------\
      Data Cleaning
    \-------------------------------------------------------------------------------------------**/

        {
            name: 'query-overview',
            main: 'queryOverview',
            sub: null,
            css: null,
            schema: 'settings-schema.json',
            defaultData: 'clinical-trials/data-cleaning/queries.csv'
        },
        {
            name: 'crf-heat-map',
            main: 'crfHeatMap',
            sub: null,
            css: null,
            schema: 'settings-schema.json',
            defaultData: 'clinical-trials/data-cleaning/forms.csv'
        },
        {
            name: 'participant-visit-listing',
            main: 'participantVisitListing',
            sub: null,
            css: null,
            schema: 'settings-schema.json',
            defaultData: 'clinical-trials/data-cleaning/visits.csv'
        },

    /**-------------------------------------------------------------------------------------------\
      Dashboard charts
    \-------------------------------------------------------------------------------------------**/

        {
            name: 'dashboard-charts',
            main: 'dashboardCharts',
            sub: 'renderers.accrual',
            css: null,
            schema: 'settings-schema.json',
            defaultData: 'clinical-trials/data-cleaning/dashboard-accrual.csv'
        },

    /**-------------------------------------------------------------------------------------------\
      Miscellaneous
    \-------------------------------------------------------------------------------------------**/

        {
            name: 'clinical-timelines',
            main: 'clinicalTimelines',
            sub: null,
            css: null,
            schema: 'settings-schema.json',
            defaultData: 'clinical-trials/renderer-specific/adtimelines.csv'
        }
    ]
};

myCatConfig.dataFiles = dataFiles.map(function(m){
    return m.rel_path.slice(7)
});

var myCat = cat.createCat('body',myCatConfig)

myCat.init()
