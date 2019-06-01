export default function renderChart() {
    this.controls.submitWrap = this.controls.wrap
        .append('div')
        .classed('control-section submit-section', true);
    this.controls.submitButton = this.controls.submitWrap
        .append('button')
        .attr('class', 'submit')
        .text('Render Chart')
}
