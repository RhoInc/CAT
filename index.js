var myCatConfig = {
    useServer: false,
    rootURL: 'https://cdn.jsdelivr.net/gh/RhoInc',
    dataURL: 'https://raw.githubusercontent.com/RhoInc/viz-library/master/data/',
    renderers: [
        {
            name: 'web-codebook',
            main: 'webcodebook',
            sub: 'createChart',
            css: 'css/webcodebook.css',
            schema: 'settings-schema.json',
            folder: 'build',
            defaultData: 'iris.csv'
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
                folder: 'build',
                defaultData: 'safetyData/ADAE.csv'
            },
            {
                name: 'aetimelines',
                main: 'aeTimelines',
                sub: null,
                css: null,
                schema: 'settings-schema.json',
                folder: 'build',
                defaultData: 'safetyData/ADAE.csv'
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
                folder: 'build',
                defaultData: 'safetyData/ADBDS.csv'
            },
            {
                name: 'safety-outlier-explorer',
                main: 'safetyOutlierExplorer',
                sub: null,
                css: null,
                schema: 'settings-schema.json',
                folder: 'build',
                defaultData: 'safetyData/ADBDS.csv'
            },
            {
                name: 'paneled-outlier-explorer',
                main: 'paneledOutlierExplorer',
                sub: null,
                css: null,
                schema: 'settings-schema.json',
                folder: 'build',
                defaultData: 'safetyData/ADBDS.csv'
            },
            {
                name: 'safety-results-over-time',
                main: 'safetyResultsOverTime',
                sub: null,
                css: null,
                schema: 'settings-schema.json',
                folder: 'build',
                defaultData: 'safetyData/ADBDS.csv'
            },
            {
                name: 'safety-shift-plot',
                main: 'safetyShiftPlot',
                sub: null,
                css: null,
                schema: 'settings-schema.json',
                folder: 'build',
                defaultData: 'safetyData/ADBDS.csv'
            },
            {
                name: 'safety-eDISH',
                main: 'safetyedish',
                sub: null,
                css: null,
                schema: 'settings-schema.json',
                folder: 'build',
                defaultData: 'safetyData/ADBDS.csv',
                rootURL: 'https://cdn.jsdelivr.net/gh/ASA-DIA-InteractiveSafetyGraphics',
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
            folder: 'build',
            defaultData: 'dataCleaning/queries/queries.csv'
        },
        {
            name: 'crf-heat-map',
            main: 'crfHeatMap',
            sub: null,
            css: null,
            schema: 'settings-schema.json',
            folder: 'build',
            defaultData: 'dataCleaning/forms/dmc_DataPage.csv'
        },
        {
            name: 'participant-visit-listing',
            main: 'participantVisitListing',
            sub: null,
            css: null,
            schema: 'settings-schema.json',
            folder: '',
            defaultData: 'dataCleaning/visits/dmv_Visits.csv'
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
            folder: 'build',
            defaultData: 'safetyData/ADTIMELINES.csv'
        }
    ]
};

myCatConfig.dataFiles = dataFiles.map(function(m){
    return m.rel_path.slice(7)
});

var myCat = cat.createCat('body',myCatConfig)

myCat.init()
