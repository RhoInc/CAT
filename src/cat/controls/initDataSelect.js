import { showDataPreview } from '../datapreview/showDataPreview';

export function initDataSelect() {
    var cat = this;
    cat.controls.dataWrap.append('h3').text('2. Choose a data Set');
    cat.controls.dataFileSelect = cat.controls.dataWrap.append('select');

    cat.controls.dataWrap
        .append('span')
        .html('&#128269;')
        .style('cursor', 'pointer')
        .on('click', function() {
            showDataPreview(cat);
        });

    cat.controls.dataFileSelect
        .selectAll('option')
        .data(cat.config.dataFiles)
        .enter()
        .append('option')
        .text(d => d.label)
        .property('selected', function(d) {
            return cat.current.defaultData == d.label ? true : null;
        });
}
