import { showDataPreview } from '../datapreview/showDataPreview';

export function initDataSelect() {
    this.controls.viewData
        .on('click', function() {
            showDataPreview(this);
        });

    this.controls.dataFileSelect
        .selectAll('option')
        .property('selected', d => this.current.defaultData === d);
}
