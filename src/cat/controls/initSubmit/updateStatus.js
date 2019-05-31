export default function updateStatus() {
    this.printStatus = true;
    this.statusDiv = this.chartWrap.append('div').attr('class', 'status');
    this.statusDiv
        .append('div')
        .text('Starting to render the chart ... ')
        .classed('info', true);
}
