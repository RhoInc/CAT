export default function library() {
    this.controls.rendererWrap.append('span').text('Library: ');
    this.controls.rendererSelect = this.controls.rendererWrap.append('select');
    this.controls.rendererSelect
        .selectAll('option')
        .data(this.config.renderers)
        .enter()
        .append('option')
        .text(d => d.name);
    this.controls.rendererWrap.append('br');
}
