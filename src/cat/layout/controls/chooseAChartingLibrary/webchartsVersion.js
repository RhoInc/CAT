export default function webchartsVersion() {
    this.controls.rendererWrap
        .append('span')
        .text('Webcharts Version: ')
        .classed('hidden', true);
    this.controls.libraryVersion = this.controls.rendererWrap
        .append('select')
        .classed('hidden', true);
    this.controls.rendererWrap.append('br').classed('hidden', true);
}
