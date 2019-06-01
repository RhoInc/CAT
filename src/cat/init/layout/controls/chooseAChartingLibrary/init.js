export default function init() {
    this.controls.rendererWrap
        .append('span')
        .text(' Init: ')
        //.classed('hidden', true);
    this.controls.mainFunction = this.controls.rendererWrap.append('input')//.classed('hidden', true);
    this.controls.rendererWrap
        .append('span')
        .text('.')
        //.classed('hidden', true);
    this.controls.subFunction = this.controls.rendererWrap.append('input')//.classed('hidden', true);
    this.controls.rendererWrap.append('br')//.classed('hidden', true);
}
