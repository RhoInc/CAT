import { scriptLoader } from "../util/scriptLoader";
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

  var loader = new scriptLoader();
  loader.require(rendererPath, {
    async: true,
    success: function() {
      cat.status.loadStatus(
        cat.statusDiv,
        true,
        rendererPath,
        rendererObj.name,
        version
      );
      renderChart(cat);
    },
    failure: function() {
      cat.status.loadStatus(
        cat.statusDiv,
        false,
        rendererPath,
        rendererObj.name,
        version
      );
    }
  });
}
