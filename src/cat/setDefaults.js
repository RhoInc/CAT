import defaultSettings from './defaultSettings';

export default function setDefaults() {
    this.config.useServer = this.config.useServer || defaultSettings.useServer;
    this.config.rootURL = this.config.rootURL || defaultSettings.rootURL;
    this.config.dataURL = this.config.dataURL || defaultSettings.dataURL;
    this.config.dataFiles = this.config.dataFiles || defaultSettings.dataFiles;
    this.config.renderers = this.config.renderers || defaultSettings.renderers;

    this.config.dataFiles = this.config.dataFiles.map(df => {
        return typeof df === 'string'
            ? { label: df, path: this.config.dataURL, user_loaded: false }
            : df;
    });
}
