export default function addControlsToggle() {
    const styleSheet = Array.from(document.styleSheets).find(
        styleSheet => styleSheet.href.indexOf('cat.css') > -1
    );
    const controlsWidth = Array.from(styleSheet.cssRules).find(
        cssRule => cssRule.selectorText === '.cat-wrap .cat-controls'
    ).style.width;

    //Minimize controls.
    this.controls.minimize = this.wrap
        .append('div')
        .classed('cat-button cat-button--minimize hidden', true)
        .attr('title', 'Hide controls')
        .text('<<');
    this.controls.minimize.on('click', () => {
        this.controls.wrap.classed('hidden', true);
        this.chartWrap.style('margin-left', 0);
        this.chartWrap.selectAll('.wc-chart').each(function(d) {
            try {
                d.draw();
            } catch (error) {}
        });
        this.dataWrap.style('margin-left', 0);
        this.controls.minimize.classed('hidden', true);
        this.controls.maximize.classed('hidden', false);
    });

    //Maximize controls.
    this.controls.maximize = this.wrap
        .append('div')
        .classed('cat-button cat-button--maximize hidden', true)
        .attr('title', 'Show controls')
        .text('>>');
    this.controls.maximize.on('click', () => {
        this.controls.wrap.classed('hidden', false);
        this.chartWrap.style('margin-left', controlsWidth);
        this.chartWrap.selectAll('.wc-chart').each(function(d) {
            try {
                d.draw();
            } catch (error) {}
        });
        this.dataWrap.style('margin-left', controlsWidth);
        this.controls.minimize.classed('hidden', false);
        this.controls.maximize.classed('hidden', true);
    });
}
