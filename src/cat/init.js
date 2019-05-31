import layout from './layout';
import setDefaults from './setDefaults';
import loadWebcharts from './init/loadWebcharts';
import getVersions from './init/getVersions';
import loadPackageJSON from './init/loadPackageJSON';
import loadRenderer from './init/loadRenderer';

export default function init() {
    //layout
    layout.call(this);

    //settings
    setDefaults.call(this);

    //initialize controls
    this.controls.init.call(this);

    //load charting library and charting application library
    loadWebcharts.call(this, 'master');
    getVersions.call(this, this.controls.libraryVersion);
    this.current = this.config.renderers[0];
    this.current.version = 'master';
    loadPackageJSON.call(this)
        .then(response => {
            loadRenderer.call(this, 'master', response)
            getVersions.call(this, this.controls.versionSelect, this.current.api_url);
        });
}
