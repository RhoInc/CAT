import dataFile from './chooseADataset/dataFile';
import loadADataFile from './chooseADataset/loadADataFile';

export default function chooseADataset() {
    this.controls.dataWrap = this.controls.wrap
        .append('div')
        .classed('control-section data-section', true);
    this.controls.dataWrap.append('h3').text('2. Choose a Dataset');
    dataFile.call(this);
    this.controls.viewData = this.controls.dataWrap
        .append('span')
        .html('&#128269;')
        .style('cursor', 'pointer');
    loadADataFile.call(this);
}
