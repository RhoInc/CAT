import destroyChart from './renderChart/destroyChart';
import loadData from './renderChart/loadData';
import initializeChart from './renderChart/initializeChart';

/*
    1. Destroys the currently displayed chart if one has been rendered.
    2. Loads the selected data file.
    3. Initializes the selected charting application library.
*/

export default function renderChart() {
    this.controls.submitButton.on('click', () => {
        this.dataWrap.classed('hidden', true);
        this.chartWrap.classed('hidden', false);
        destroyChart.call(this);
        loadData.call(this)
            .then(json => {
                initializeChart.call(this, json);
            });
    });
}
