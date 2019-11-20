export function layout() {
    var cat = this;
    /* Layout primary sections */
    cat.controls.wrap = cat.wrap.append('div').classed('cat-controls section', true);
    cat.chartWrap = cat.wrap.append('div').classed('cat-chart section', true);
    cat.dataWrap = cat.wrap
        .append('div')
        .classed('cat-data section', true)
        .classed('hidden', true);

    /* Layout CAT Controls Divs */
    cat.controls.wrap
        .append('h2')
        .classed('cat-controls-header', true)
        .text('Charting Application Tester 😼');

    cat.controls.submitWrap = cat.controls.wrap
        .append('div')
        .classed('control-section submit-section', true);

    cat.controls.rendererWrap = cat.controls.wrap
        .append('div')
        .classed('control-section renderer-section', true);

    cat.controls.dataWrap = cat.controls.wrap
        .append('div')
        .classed('control-section data-section', true);

    cat.controls.settingsWrap = cat.controls.wrap
        .append('div')
        .classed('control-section settings-section', true);

    cat.controls.environmentWrap = cat.controls.wrap
        .append('div')
        .classed('control-section environment-section', true);
}
