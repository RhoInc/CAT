export default function addControlsToggle() {
    const cat = this;

    this.controls.minimize = this.controls.submitWrap
        .append('div')
        .classed('cat-button cat-button--minimize hidden', true)
        .attr('title', 'Hide controls')
        .text('<<')
        .on('click', () => {
            this.controls.wrap.classed('hidden', true);
            this.chartWrap.style('margin-left', 0);
            this.chartWrap.selectAll('.wc-chart').each(function(d) {
                try {
                    d.draw();
                } catch (error) {}
            });
            this.dataWrap.style('margin-left', 0);
            this.controls.maximize = this.wrap
                .insert('div', ':first-child')
                .classed('cat-button cat-button--maximize', true)
                .text('>>')
                .attr('title', 'Show controls')
                .on('click', function() {
                    cat.controls.wrap.classed('hidden', false);
                    cat.chartWrap.style('margin-left', '20%');
                    cat.chartWrap.selectAll('.wc-chart').each(function(d) {
                        try {
                            d.draw();
                        } catch (error) {}
                    });
                    cat.dataWrap.style('margin-left', '20%');
                    d3.select(this).remove();
                });
        });
}
