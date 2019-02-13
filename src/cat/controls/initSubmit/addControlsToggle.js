export default function toggleControls() {
    this.controls.minimize = this.controls.submitWrap
        .append('div')
        .classed('cat-button cat-button--minimize hidden', true)
        .attr('title', 'Hide controls')
        .text('<<')
        .on('click', () => {
            this.controls.wrap.classed('hidden', true);
            this.chartWrap.style('margin-left', 0);
            this.dataWrap.style('margin-left', 0);
            this.controls.maximize = this.wrap
                .insert('div', ':first-child')
                .classed('cat-button cat-button--maximize', true)
                .text('>>')
                .attr('title', 'Show controls')
                .on('click', function() {
                    this.controls.wrap.classed('hidden', false);
                    this.chartWrap.style('margin-left', '20%');
                    this.dataWrap.style('margin-left', '20%');
                    d3.select(this).remove();
                });
        });
}
