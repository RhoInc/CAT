export function showDataPreview(cat) {
    cat.dataWrap.classed('hidden', false);
    cat.chartWrap.classed('hidden', true);
    cat.dataWrap.selectAll('*').remove();

    if (cat.dataPreview) {
        cat.dataPreview.destroy();
    }

    var dataFile = cat.current.data;
    var dataObject = cat.config.dataFiles.find(f => f.label == dataFile);
    var path = dataObject.path + dataObject.label;

    cat.dataWrap
        .append('button')
        .text('<< Close Data Preview')
        .on('click', function() {
            cat.dataWrap.classed('hidden', true);
            cat.chartWrap.classed('hidden', false);
        });

    cat.dataWrap.append('h3').text('Data Preview for ' + dataFile);

    cat.dataWrap
        .append('div')
        .attr('class', 'dataPreview')
        .style('overflow-x', 'overlay');
    cat.dataPreview = webCharts.createTable('.dataPreview');
    if (dataObject.user_loaded) {
        cat.dataPreview.init(d3.csv.parse(dataObject.csv_raw));
    } else {
        d3.csv(path, function(raw) {
            cat.dataPreview.init(raw);
        });
    }
}
