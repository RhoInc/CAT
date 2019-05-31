import library from './chooseAChartingLibrary/library';
import version from './chooseAChartingLibrary/version';
import moreOptions from './chooseAChartingLibrary/moreOptions';
import init from './chooseAChartingLibrary/init';
import webchartsVersion from './chooseAChartingLibrary/webchartsVersion';
import schema from './chooseAChartingLibrary/schema';

export default function chooseAChartingLibrary() {
    this.controls.rendererWrap = this.controls.wrap
        .append('div')
        .classed('control-section renderer-section', true);
    this.controls.rendererWrap.append('h3').text('1. Choose a Charting Library');
    library.call(this);
    version.call(this);
    moreOptions.call(this);
    init.call(this);
    webchartsVersion.call(this);
    schema.call(this);
}
