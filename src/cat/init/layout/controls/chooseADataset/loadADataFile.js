export default function loadADataFile() {
    const loadLabel = this.controls.dataWrap.append('p').style('margin', 0);
    loadLabel
        .append('small')
        .text('Use local .csv file:')
        .append('sup')
        .html('&#9432;')
        .property(
            'title',
            'Render a chart using a local file. File is added to the data set list, and is only available for a single session and is not saved.'
        )
        .style('cursor', 'help');
    this.controls.loadStatus = loadLabel
        .append('small')
        .attr('class', 'loadStatus')
        .style('float', 'right')
        .text('Select a csv to load');
    this.controls.dataFileLoad = this.controls.dataWrap
        .append('input')
        .attr('type', 'file')
        .attr('class', 'file-load-input');
    this.controls.dataFileLoadButton = this.controls.dataWrap
        .append('button')
        .text('Load')
        .attr('class', 'file-load-button')
        .attr('disabled', true);
}
