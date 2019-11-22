import layout from './layout';
import setDefaults from './setDefaults';
import loadLibrary from './loadLibrary';
import { init as initControls } from './controls/init';

export function init() {
    //layout the cat
    this.wrap = d3
        .select(this.element)
        .append('div')
        .attr('class', 'cat-wrap');

    setDefaults.call(this); // initialize the settings
    layout.call(this); // layout the UI
    initControls.call(this); // create the controls

    //draw the first chart
    if (this.config.drawOnLoad) {
        this.printStatus = true;
        this.statusDiv = this.chartWrap.append('div').attr('class', 'status');
        this.statusDiv
            .append('div')
            .text('Starting to render the chart ... ')
            .classed('info', true);

        this.chartWrap.append('div').attr('class', 'chart');
        loadLibrary.call(this);
    }
}
