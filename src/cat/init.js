import layout from './layout';
import setDefaults from './setDefaults';
import { init as initControls } from './controls/init';

export function init() {
    //layout the cat
    this.wrap = d3
        .select(this.element)
        .append('div')
        .attr('class', 'cat-wrap');

    layout.call(this); // layout the UI
    setDefaults.call(this); // initialize the settings
    initControls.call(this); // create the controls
}
