import toggleDisplayOfControls from './layout/toggleDisplayOfControls';
import controls from './layout/controls';

export default function layout() {
    this.wrap = d3
        .select(this.element)
        .append('div')
        .attr('class', 'cat-wrap');

    //Controls display toggle
    this.hideControls = this.wrap
        .append('div')
        .classed('cat-button cat-button--hide-controls', true)
        .attr('title', 'Hide controls')
        .text('<<');
    this.showControls = this.wrap
        .append('div')
        .classed('cat-button cat-button--show-controls hidden', true)
        .attr('title', 'Show controls')
        .text('>>');
    toggleDisplayOfControls.call(this);

    //Controls
    this.controls.wrap = this.wrap.append('div').classed('cat-controls section', true);
    controls.call(this);

    //Chart
    this.chartWrap = this.wrap.append('div').classed('cat-chart section', true);

    //Table
    this.dataWrap = this.wrap
        .append('div')
        .classed('cat-data section', true)
        .classed('hidden', true);
}
