import setDefaults from './init/setDefaults';
import layout from './init/layout';
import loadData from './init/loadData';
import loadChartingLibrary from './init/loadChartingLibrary';
import loadChartingApplication from './init/loadChartingApplication';
import initializeControls from './init/initializeControls';

export default function init() {
    //settings
    setDefaults.call(this);

    //layout
    layout.call(this);

    //renderers and data files
    loadData.call(this);

    //load charting library
    loadChartingLibrary.call(this);

    //load charting application
    loadChartingApplication.call(this);

    //initialize controls
    initializeControls.call(this);
}
