export default function schema() {
    this.controls.rendererWrap
        .append('span')
        .text('Schema: ')
        .classed('hidden', true);
    this.controls.schema = this.controls.rendererWrap.append('input').classed('hidden', true);
    this.controls.rendererWrap.append('br').classed('hidden', true);
}
