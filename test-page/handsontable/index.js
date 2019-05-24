fetch('https://raw.githubusercontent.com/RhoInc/data-library/master/data/miscellaneous/iris.csv')
    .then(response => response.text())
    .then(text => {
        const chartSettings = {
            x: {
                type: 'linear',
                column: 'sepal width',
                label: 'Sepal Width'
            },
            y: {
                type: 'linear',
                column: 'sepal length',
                label: 'Sepal Length'
            },
            marks: [
                {
                    type: 'circle',
                    per: ['species', 'sepal width', 'sepal length'],
                    tooltip: '[species]: $x/$y',
                    attributes: {
                        stroke: 'black'
                    }
                }
            ],
            color_by: 'species',
            color_dom: null,
            legend: {
                label: 'Species',
                location: 'top'
            },
            resizable: false
        };
        const chart = new webCharts.createChart(
            document.getElementById('chart'),
            chartSettings,
        );
        const data = d3.csv.parse(text);
        chart.init(data);
        const colHeaders = Object.keys(data[0]);
        const table = new Handsontable(
            document.getElementById('table'),
            {
                data,
                colHeaders,
                //columns: colHeaders.map(_ => { return {type: 'text'}; }),
                filters: true,
                afterChange: function(changes) {
                    const updatedData = this.getData()
                        .map(d => {
                            return d.reduce(
                                (acc,cur,i) => {
                                    acc[colHeaders[i]] = cur;
                                    return acc;
                                },
                                {}
                            );
                        });
                    chart.draw(updatedData);
                },
                licenseKey: 'non-commercial-and-evaluation',
            },
        );
    });
