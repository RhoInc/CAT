import scriptLoader from '../../util/scriptLoader';

export default function loadWebcharts(library, version, response) {
    // --- load css --- //
    const cssPath =
        version !== 'master'
            ? this.config.rootURL + '/Webcharts@' + version + '/css/webcharts.css'
            : this.config.rootURL + '/Webcharts/css/webcharts.css';

    const link = document.createElement('link');
    link.href = cssPath;
    link.type = 'text/css';
    link.rel = 'stylesheet';
    document.getElementsByTagName('head')[0].appendChild(link);

    // --- load js --- //
    const rendererPath =
        version !== 'master'
            ? this.config.rootURL + '/' + library + '@' + version + '/build/webcharts.js'
            : this.config.rootURL + '/Webcharts/build/webcharts.js';

    const loader = new scriptLoader();
    loader.require(rendererPath, {
        async: true,
        success: () => {
            //this.status.loadStatus(this.statusDiv, true, rendererPath, library, version);
        },
        failure: () => {
            //this.status.loadStatus(this.statusDiv, false, rendererPath, library, version);
        }
    });
}
