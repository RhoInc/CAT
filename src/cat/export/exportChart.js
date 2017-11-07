export function exportChart(cat) {
  console.log(cat);
  const exampleTemplate = `
<!DOCTYPE html>
    <html>
    <head>
        <title>${cat.current.name}</title>

        <meta http-equiv = 'Content-Type' content = 'text/html; charset = utf-8'>

        <script type = 'text/javascript' src = 'https://d3js.org/d3.v3.min.js'></script>
        <script type = 'text/javascript' src = 'https://rawgit.com/RhoInc/Webcharts/master/build/webcharts.js'></script>
        <script type = 'text/javascript' src = 'https://rawgit.com/RhoInc/paneled-outlier-explorer/master/build/paneledOutlierExplorer.js'></script>

        <link type = 'text/css' rel = 'stylesheet' href = 'https://rawgit.com/RhoInc/Webcharts/master/css/webcharts.min.css'>
    </head>

    <body>
        <div id = 'title'>${cat.current.name} created for ${cat.current
    .defaultData}</div>
        <div id = 'subtitle'></div>
        <div id = 'container'>
        </div>
    </body>

    <script type = 'text/javascript'>
        let settings = {
            measure_col: 'VSTEST',
            time_col: 'VSDY',
            value_col: 'VSSTRESN'
        };
        let chart = paneledOutlierExplorer('#container', {});
        d3.csv('../../data/hys_law.csv', function(data) {
            chart.init(data);
        });
    </script>
</html>
`;
  return exampleTemplate;
}
