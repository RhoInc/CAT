import destroyChart from './initSubmit/destroyChart';
import updateStatus from './initSubmit/updateStatus';
import loadData from './initSubmit/loadData';
import initializeChart from './initSubmit/initializeChart';

/*
    1. Destroys the currently displayed chart if one has been rendered.
    2. Updates the status section.
    3. Loads the selected data file.
    4. Initializes the selected charting application library.
*/

export function initSubmit() {
    this.controls.submitButton.on('click', () => {
        this.dataWrap.classed('hidden', true);
        this.chartWrap.classed('hidden', false);
        destroyChart.call(this);
        updateStatus.call(this);
        loadData.call(this)
            .then(json => {
                initializeChart.call(this, json);
            });
    });
}
