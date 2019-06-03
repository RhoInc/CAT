export default function initializeChart(data) {
    this.chartWrap.append('div').attr('class', 'chart');

    //Pass element and settings to charting application.
    if (this.chartingApplication.sub) {
        this.chartingApplicationInstance = window[this.chartingApplication.main][this.chartingApplication.sub](
            '.cat-chart .chart',
            this.chartingApplication.config || {}
        );
    } else {
        this.chartingApplicationInstance = window[this.chartingApplication.main](
            '.cat-chart .chart',
            this.chartingApplication.config || {}
        );
    }

    //Pass data to charting application.
    try {
        this.chartingApplicationInstance.init(data);
    } catch (err) {
        console.warn(err);
    }
}
