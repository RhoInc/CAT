export default function moreOptions() {
    this.controls.moreOptions = this.controls.rendererWrap
        .append('a')
        .text('More Options')
        .style('text-decoration', 'underline')
        .style('color', 'blue')
        .style('cursor', 'pointer');
}
