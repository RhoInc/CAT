export default function destroyChart() {
    if (this.previous) {
        if (this.previous.instance && this.previous.instance.destroy) {
            console.log('destroy');
            console.log(this.previous);
            if (this.previous.instance && this.previous.instance.destroy)
                this.previous.instance.destroy();
        } else {
            console.log('no destroy');
            console.log(this.previous);
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
    }

    this.chartWrap.selectAll('*').remove();
}
