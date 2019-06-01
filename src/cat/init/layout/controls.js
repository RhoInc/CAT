import renderChart from './controls/renderChart';
import chooseAChartingLibrary from './controls/chooseAChartingLibrary';
import chooseADataset from './controls/chooseADataset';
import customizeTheChart from './controls/customizeTheChart';
import environment from './controls/environment';

export default function controls() {
    this.controls.wrap
        .append('h2')
        .classed('cat-controls-header', true)
        .text('Charting Application Tester 😼');
    renderChart.call(this);
    chooseAChartingLibrary.call(this);
    chooseADataset.call(this);
    customizeTheChart.call(this);
    environment.call(this);
}
