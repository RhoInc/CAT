import defaultSettings from './defaultSettings';
import parseURL from './parseURL';

export function setDefaults() {
    var cat = this;
    cat.config.useServer = cat.config.useServer || defaultSettings.useServer;
    cat.config.rootURL = cat.config.rootURL || defaultSettings.rootURL;
    cat.config.dataURL = cat.config.dataURL || defaultSettings.dataURL;
    cat.config.dataFiles = cat.config.dataFiles || defaultSettings.dataFiles;
    cat.config.renderers = cat.config.renderers || defaultSettings.renderers;

    cat.config.dataFiles = cat.config.dataFiles.map(function(df) {
        return typeof df == 'string'
            ? { label: df, path: cat.config.dataURL, user_loaded: false }
            : df;
    });

    //get inputs from URL if any
    cat.config.defaults = parseURL();
}
