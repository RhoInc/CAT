import { renderChart } from "./renderChart";

export function loadRenderer(cat) {
  var rendererObj = cat.controls.rendererSelect
    .selectAll("option:checked")
    .data()[0];
  var version = cat.controls.versionSelect.node().value;
  var rendererPath =
    cat.config.rootURL +
    "/" +
    rendererObj.name +
    "/" +
    version +
    "/build/" +
    rendererObj.main +
    ".js";

  if (rendererObj.css) {
    var link = document.createElement("link");
    link.href =
      cat.config.rootURL +
      "/" +
      rendererObj.name +
      "/" +
      version +
      "/" +
      rendererObj.css;
    link.type = "text/css";
    link.rel = "stylesheet";
    document.getElementsByTagName("head")[0].appendChild(link);
  }

  var scriptReady = false;
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = rendererPath;
  script.onload = script.onreadystatechange = function() {
    if (!scriptReady && (!this.readyState || this.readyState == "complete")) {
      scriptReady = true;
      renderChart(cat);
    }
  };
  var tag = document.getElementsByTagName("script")[0];
  tag.parentNode.insertBefore(script, tag);
}
