import { loadRenderer } from "./loadRenderer";

export function loadLibrary(cat) {
  var version = cat.controls.libraryVersion.node().value;
  var rendererPath =
    cat.config.rootURL +
    "/" +
    "webcharts" + //hardcode to webcharts for now - could generalize later
    "/" +
    version +
    "/build/" +
    "webcharts" +
    ".js";

  var link = document.createElement("link");
  link.href =
    cat.config.rootURL +
    "/" +
    "webcharts" +
    "/" +
    version +
    "/" +
    "css" +
    "/" +
    "webcharts.css";
  link.type = "text/css";
  link.rel = "stylesheet";
  document.getElementsByTagName("head")[0].appendChild(link);

  var scriptReady = false;
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = rendererPath;
  script.onload = script.onreadystatechange = function() {
    if (!scriptReady && (!this.readyState || this.readyState == "complete")) {
      scriptReady = true;
      loadRenderer(cat);
    }
  };
  var tag = document.getElementsByTagName("script")[0];
  tag.parentNode.insertBefore(script, tag);
}
