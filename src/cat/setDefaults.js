import defaultSettings from './defaultSettings';
import parseURL from './parseURL';

export default function setDefaults() {
    var config = this.config;
    config.useServer = config.useServer || defaultSettings.useServer;
    config.rootURL = config.rootURL || defaultSettings.rootURL;
    config.dataURL = config.dataURL || defaultSettings.dataURL;
    config.dataFiles = config.dataFiles || defaultSettings.dataFiles;
    config.renderers = config.renderers || defaultSettings.renderers;

    config.dataFiles = config.dataFiles.map(function(df) {
        return typeof df == 'string' ? { label: df, path: config.dataURL, user_loaded: false } : df;
    });

    //get inputs from URL if any
    config.defaults = parseURL.call(this);
}
