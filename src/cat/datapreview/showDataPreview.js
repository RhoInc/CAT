export function showDataPreview(cat) {
    cat.dataWrap.classed('hidden', false);
    cat.chartWrap.classed('hidden', true);
    cat.dataWrap.selectAll('*').remove();

    if (cat.dataPreview) {
        cat.dataPreview.destroy();
    }

    var dataFile = cat.controls.dataFileSelect.node().value;
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
    //    .style('overflow-x', 'overlay');
    //cat.dataPreview = webCharts.createTable('.dataPreview');
    if (dataObject.user_loaded) {
        dataObject.data = d3.csv.parse(dataObject.csv_raw);
        handsOnTable(dataObject.data);
        //cat.dataPreview.init(d3.csv.parse(dataObject.csv_raw));
    } else {
        d3.csv(path, function(raw) {
            dataObject.data = raw;
            handsOnTable(dataObject.data);
            //cat.dataPreview.init(raw);
        });
    }

    function handsOnTable(data) {
        const colHeaders = Object.keys(data[0]);
        const table = new Handsontable(
            cat.dataWrap.select('.dataPreview').node(),
            {
                data: data.map(d => Object.keys(d).map(key => d[key])),
                colHeaders,
                columns: colHeaders.map(_ => { return {type: 'text'}; }),
                rowHeaders: true,
                dropdownMenu: true,
                filters: true,
                afterChange: function(changes) {
                    dataObject.json = this.getData()
                        .map(d => {
                            return d.reduce(
                                (acc,cur,i) => {
                                    acc[colHeaders[i]] = cur;
                                    return acc;
                                },
                                {}
                            );
                        });
                },
                afterFilter: function(changes) {
                    dataObject.json = this.getData()
                        .map(d => {
                            return d.reduce(
                                (acc,cur,i) => {
                                    acc[colHeaders[i]] = cur;
                                    return acc;
                                },
                                {}
                            );
                        });
                },
                licenseKey: 'non-commercial-and-evaluation',
            },
        );
    }
}
