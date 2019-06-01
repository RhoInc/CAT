export default function toggleDisplayOfControls() {
    const styleSheet = Array.from(document.styleSheets).find(
        styleSheet => styleSheet.href.indexOf('cat.css') > -1
    );
    const controlsWidth = Array.from(styleSheet.cssRules).find(
        cssRule => cssRule.selectorText === '.cat-wrap .cat-controls'
    ).style.width;

    //Hide controls.
    this.hideControls.on('click', () => {
        this.controls.wrap.classed('hidden', true);
        this.chartWrap.style('margin-left', 0);
        this.chartWrap.selectAll('.wc-chart').each(function(d) {
            try {
                d.draw();
            } catch (error) {}
        });
        this.dataWrap.style('margin-left', 0);
        this.hideControls.classed('hidden', true);
        this.showControls.classed('hidden', false);
    });

    //Show controls.
    this.showControls.on('click', () => {
        this.controls.wrap.classed('hidden', false);
        this.chartWrap.style('margin-left', controlsWidth);
        this.chartWrap.selectAll('.wc-chart').each(function(d) {
            try {
                d.draw();
            } catch (error) {}
        });
        this.dataWrap.style('margin-left', controlsWidth);
        this.hideControls.classed('hidden', false);
        this.showControls.classed('hidden', true);
    });
}
