import defaultSettings from '../defaultSettings';

export default function setDefaults() {
    this.config.useServer = this.config.useServer || defaultSettings.useServer;
    this.config.rootURL = this.config.rootURL || defaultSettings.rootURL;
    this.config.apiURL = this.config.rootURL.replace('github.com', 'api.github.com/repos');
    this.config.cdnURL = this.config.rootURL.replace('github.com', 'cdn.jsdelivr.net/gh');
    this.config.dataURL = this.config.dataURL || defaultSettings.dataURL;
    this.config.chartingLibrary = this.config.chartingLibrary || defaultSettings.chartingLibrary;
    this.config.renderers = this.config.renderers || defaultSettings.renderers;
    this.config.dataFiles = this.config.dataFiles || defaultSettings.dataFiles;

    this.config.renderers.forEach(renderer => {
        renderer.label = renderer.label || renderer.name;
    });

    this.config.dataFiles = this.config.dataFiles.map(df => {
        return typeof df === 'string'
            ? { label: df, path: this.config.dataURL, user_loaded: false }
            : df;
    });
}
