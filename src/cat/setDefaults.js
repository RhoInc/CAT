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

    //display options
    config.drawOnLoad = false; // can be changed in URL with /?draw
    config.showControls = true; // can be changed in URL with /?controls=hide
    config.showControlsToggle = true; // can be changed in URL with /?controls=min

    //get inputs from URL if any
    config.fromURL = parseURL.call(this);

    // set values for initial renderer
    this.current = this.config.fromURL.renderer_obj || this.config.renderers[0];
    this.current.version = this.config.fromURL.version || 'master';
    this.current.defaultData = this.config.fromURL.data || this.current.defaultData;
    this.current.data = this.current.defaultData;
    this.current.config = this.config.fromURL.settings || {};
}
