const myCatConfig = {
    useServer: false,
    rootURL: 'https://cdn.jsdelivr.net/gh/RhoInc',
    dataURL: 'https://raw.githubusercontent.com/RhoInc/data-library/master/data/',
    repoURL: 'https://cdn.jsdelivr.net/gh/RhoInc/graphics/data',
    repoURL: '../graphics/data',
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
                main: 'safetyedish',
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

//Modify renderer objects.
myCatConfig.renderers
    .forEach(function(renderer) {
        renderer.rootURL = renderer.rootURL || myCatConfig.rootURL;
        renderer.api_url = renderer.rootURL.replace('cdn.jsdelivr.net/gh', 'api.github.com/repos') + '/' + renderer.name;
        renderer.branches_api_url = renderer.api_url + '/branches';
        renderer.releases_api_url = renderer.api_url + '/releases';
    });

//Map data file objects to a path relative to myCatConfig.dataURL.
myCatConfig.dataFiles = dataFiles
    .map(function(dataFile) {
        return dataFile.rel_path.slice(7);
    });

//Instantiate CAT.
const myCat = cat.createCat('body',myCatConfig);

//Read in repository data from graphics repo.
Promise
    .all([
        fetch(`${myCat.config.repoURL}/repos.json`),
        fetch(`${myCat.config.repoURL}/releases.json`),
        fetch(`${myCat.config.repoURL}/branches.json`),
    ])
    .then(responses => Promise.all(responses.map(response => response.json())))
    .then(json => {
        const [repos,releases,branches] = json;
        myCat.repos = repos;
        myCat.releases = releases;
        myCat.branches = branches;

        //Initialize CAT.
        myCat.init();
    });
