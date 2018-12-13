import { loadLibrary } from '../loadLibrary';

export function initSubmit(cat) {
    cat.controls.submitButton = cat.controls.submitWrap
        .append('button')
        .attr('class', 'submit')
        .text('Render Chart')
        .on('click', function() {
            cat.controls.minimize = cat.controls.submitWrap
                .append('div')
                .classed('cat-button cat-button--minimize', true)
                .attr('title', 'Hide controls')
                .text('<<')
                .on('click', () => {
                    cat.controls.wrap.classed('hidden', true);
                    cat.chartWrap.style('margin-left', 0);
                    cat.dataWrap.style('margin-left', 0);
                    cat.wrap
                        .insert('div', ':first-child')
                        .classed('cat-button cat-button--maximize', true)
                        .text('>>')
                        .attr('title', 'Show controls')
                        .on('click', function() {
                            cat.controls.wrap.classed('hidden', false);
                            cat.chartWrap.style('margin-left', '20%');
                            cat.dataWrap.style('margin-left', '20%');
                            d3.select(this).remove();
                        });
                });
            cat.dataWrap.classed('hidden', true);
            cat.chartWrap.classed('hidden', false);

            //Disable and/or remove previously loaded stylesheets.
            d3
                .selectAll('link')
                .filter(function() {
                    return !this.href.indexOf('css/cat.css');
                })
                .property('disabled', true)
                .remove();

            d3
                .selectAll('style')
                .property('disabled', true)
                .remove();

            cat.chartWrap.selectAll('*').remove();
            cat.printStatus = true;
            cat.statusDiv = cat.chartWrap.append('div').attr('class', 'status');
            cat.statusDiv
                .append('div')
                .text('Starting to render the chart ... ')
                .classed('info', true);

            cat.chartWrap.append('div').attr('class', 'chart');
            loadLibrary(cat);
        });
}
