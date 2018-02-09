import defaultSettings from "./defaultSettings";

export function setDefaults(cat) {
  cat.config.useServer = cat.config.useServer || defaultSettings.useServer;
  cat.config.rootURL = cat.config.rootURL || defaultSettings.rootURL;
  cat.config.dataURL = cat.config.dataURL || defaultSettings.dataURL;
  cat.config.dataFiles = cat.config.dataFiles || defaultSettings.dataFiles;
  cat.config.renderers = cat.config.renderers || defaultSettings.renderers;
}
