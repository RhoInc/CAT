import { loadLibrary } from '../../loadLibrary';

export default function initializeChart(data) {
    this.chartWrap.append('div').attr('class', 'chart');

    this.status.loadStatus(this.statusDiv, true, this.dataObject.dataFilePath);

    if (this.current.sub) {
        this.current.instance = window[this.current.main][this.current.sub](
            '.cat-chart',
            this.current.config
        );
        this.status.chartCreateStatus(this.statusDiv, this.current.main, this.current.sub);
    } else {
        this.current.instance = window[this.current.main](
            '.cat-chart .chart',
            this.current.config
        );
        this.status.chartCreateStatus(this.statusDiv, this.current.main);
    }

    //this.current.htmlExport = createChartExport(this); // save the source code before init

    try {
        this.current.instance.init(data);
    } catch (err) {
        this.status.chartInitStatus(this.statusDiv, false, err);
    } finally {
        this.status.chartInitStatus(this.statusDiv, true, null, this.current.htmlExport);

        // save to server button
        if (this.config.useServer) {
            this.status.saveToServer(this);
        }
        //showEnv(this);

        //don't print any new statuses until a new chart is rendered
        this.printStatus = false;
    }

    this.current.rendered = true;
}
