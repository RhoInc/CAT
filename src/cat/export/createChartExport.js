export function createChartExport(cat) {
    /* Get settings from current controls */
    var webcharts_version = cat.controls.libraryVersion.node().value;
    var renderer_version = cat.controls.versionSelect.node().value;
    var data_file = cat.controls.dataFileSelect.node().value;
    var data_file_path = cat.config.dataURL + data_file;
    var init_string = cat.current.sub ? cat.current.main + '.' + cat.current.sub : cat.current.main;

    var chart_config = JSON.stringify(cat.current.config, null, ' ');
    var renderer_css = '';
    if (cat.current.css) {
        var css_path =
            cat.config.rootURL +
            '/' +
            cat.current.name +
            '/' +
            renderer_version +
            '/' +
            cat.current.css;
        renderer_css = "<link type = 'text/css' rel = 'stylesheet' href = '" + css_path + "'>";
    }

    /* Return a html for a working chart */
    const exampleTemplate = `
<!DOCTYPE html>\n
    <html>\n
    <head>
        <title>${cat.current.name}</title>

        <meta http-equiv = 'Content-Type' content = 'text/html; charset = utf-8'>

        <script type = 'text/javascript' src = 'https://d3js.org/d3.v3.min.js'></script>
        <script type = 'text/javascript' src = 'https://rawgit.com/RhoInc/Webcharts/${webcharts_version}/build/webcharts.js'></script>
        <script type = 'text/javascript' src = 'https://rawgit.com/RhoInc/${cat.current.name}/${renderer_version}/build/${cat.current.main}.js'></script>

        <link type = 'text/css' rel = 'stylesheet' href = 'https://rawgit.com/RhoInc/Webcharts/${webcharts_version}/css/webcharts.min.css'>
        ${renderer_css}
    </head>

    <body>
        <h1 id = 'title'>${cat.current.name} created for ${cat.current.defaultData}</h1>
        <div id = 'container'>
        </div>
    </body>

    <script type = 'text/javascript'>
        let settings = ${chart_config}
        let chart = ${init_string}('#container', settings);
        d3.csv('${data_file_path}', function(data) {
            chart.init(data);
        });

    </script>
</html>
`;
    return exampleTemplate;
}
