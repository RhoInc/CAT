import { loadLibrary } from '../../loadLibrary';
import createChartURL from '../../export/createChartURL';

export default function addSubmitButton() {
    this.controls.submitButton = this.controls.submitWrap
        .append('button')
        .attr('class', 'submit')
        .text('Render Chart')
        .on('click', () => {
            this.controls.minimize.classed('hidden', false);
            this.dataWrap.classed('hidden', true);
            this.chartWrap.classed('hidden', false);

            //Disable and/or remove previously loaded stylesheets.
            d3.selectAll('link')
                .filter(function() {
                    return !this.href.indexOf('css/cat.css');
                })
                .property('disabled', true)
                .remove();

            d3.selectAll('style')
                .property('disabled', true)
                .remove();

            this.chartWrap.selectAll('*').remove();
            this.printStatus = true;
            this.statusDiv = this.chartWrap.append('div').attr('class', 'status');
            this.statusDiv
                .append('div')
                .text('Starting to render the chart ... ')
                .classed('info', true);

            this.chartWrap.append('div').attr('class', 'chart');
            loadLibrary(this);
        });

    //add permalink
    const permawrap = this.controls.submitWrap.append('div').attr('class', 'permalink-wrap');
    permawrap
        .append('span')
        .text('Link:')
        .style('cursor', 'help')
        .attr(
            'title',
            'Click here to visit or copy the URL for a standalone page for the current chart.\nNote that this only captures the renderer, settings, version and requires a saved data set. Other options (e.g. webcharts version) and uploaded data sets are not supported at this time.'
        );

    this.controls.chartLink = permawrap
        .append('a')
        .attr('href', createChartURL.call(this))
        .html('&#128279;')
        .attr('target', '_blank')
        .attr('title', 'Open in new tab');

    this.controls.chartCopy = permawrap
        .append('a')
        .html('&#128203')
        .style('cursor', 'pointer')
        .attr('title', 'Copy link');
}
