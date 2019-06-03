export default function destroyChart() {
    if (this.chartingApplicationInstance) {
        if (this.chartingApplicationInstance && this.chartingApplicationInstance.destroy) {
            if (this.chartingApplicationInstance && this.chartingApplicationInstance.destroy)
                this.chartingApplicationInstance.destroy();
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
    }

    this.chartWrap.selectAll('*').remove();
}
