fetch('https://raw.githubusercontent.com/RhoInc/data-library/master/data/miscellaneous/climate-data.csv')
    .then(response => response.text())
    .then(text => {
        //const chartSettings = {
        //    x: {
        //        type: 'linear',
        //        column: 'sepal width',
        //        label: 'Sepal Width'
        //    },
        //    y: {
        //        type: 'linear',
        //        column: 'sepal length',
        //        label: 'Sepal Length'
        //    },
        //    marks: [
        //        {
        //            type: 'circle',
        //            per: ['species', 'sepal width', 'sepal length'],
        //            tooltip: '[species]: $x/$y',
        //            attributes: {
        //                stroke: 'black'
        //            }
        //        }
        //    ],
        //    color_by: 'species',
        //    color_dom: null,
        //    legend: {
        //        label: 'Species',
        //        location: 'top'
        //    },
        //    resizable: false
        //};
        //const controls = new webCharts.createControls(
        //    document.getElementById('chart'),
        //    {
        //        inputs: [
        //            {
        //                type: 'subsetter',
        //                value_col: 'species',
        //                label: 'Species'
        //            }
        //        ]
        //    }
        //);
        //const chart = new webCharts.createChart(
        //    document.getElementById('chart'),
        //    chartSettings,
        //    controls
        //);
        const data = d3.csv.parse(text);
        console.log(data);
        //chart.init(data);
        const colHeaders = Object.keys(data[0]);
        const table = new Handsontable(
            document.getElementById('table'),
            {
                data: data.map(d => Object.keys(d).map(key => d[key])),
                colHeaders,
                columns: colHeaders.map(_ => { return {name: _, type: 'text'}; }),
                rowHeaders: true,
                dropdownMenu: true,
                filters: true,
                //afterChange: function(changes) {
                //    const updatedData = this.getData()
                //        .map(d => {
                //            return d.reduce(
                //                (acc,cur,i) => {
                //                    acc[colHeaders[i]] = cur;
                //                    return acc;
                //                },
                //                {}
                //            );
                //        });
                //    chart.draw(updatedData);
                //},
                //afterFilter: function(changes) {
                //    const updatedData = this.getData()
                //        .map(d => {
                //            return d.reduce(
                //                (acc,cur,i) => {
                //                    acc[colHeaders[i]] = cur;
                //                    return acc;
                //                },
                //                {}
                //            );
                //        });
                //    chart.draw(updatedData);
                //},
                licenseKey: 'non-commercial-and-evaluation',
            },
        );
    });
