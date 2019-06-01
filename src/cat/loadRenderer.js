import loadWebcharts from './loadRenderer/loadWebcharts';
import getVersions from './loadRenderer/getVersions';
import loadPackageJSON from './loadRenderer/loadPackageJSON';
import loadRenderer from './loadRenderer/loadRenderer';

export default function loadRenderer() {
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
