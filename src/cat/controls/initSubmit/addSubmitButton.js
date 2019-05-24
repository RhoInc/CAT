import { loadLibrary } from '../../loadLibrary';

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

            if (this.previous) {
                console.log(this.previous);
                if (this.previous.instance && this.previous.instance.destroy)
                    this.previous.instance.destroy();
            } else {
                this.chartWrap.selectAll('.wc-chart').each(function(chart) {
                    if (chart.destroy) chart.destroy();
                    else {
                        //remove resize event listener
                        select(window).on('resize.' + chart.element + chart.id, null);

                        //destroy controls
                        if (chart.controls) {
                            chart.controls.destroy();
                        }

                        //unmount chart wrapper
                        chart.wrap.remove();
                    }
                });
            }

            this.chartWrap.selectAll('*').remove();
            this.printStatus = true;
            this.statusDiv = this.chartWrap.append('div').attr('class', 'status');
            this.statusDiv
                .append('div')
                .text('Starting to render the chart ... ')
                .classed('info', true);

            this.chartWrap.append('div').attr('class', 'chart');
            loadLibrary(this);
            console.log(this.current);
        });
}
