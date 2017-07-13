import { scriptLoader } from "../util/scriptLoader";
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

  var loader = new scriptLoader();
  loader.require(rendererPath, {
    async: true,
    success: function() {
      cat.statusDiv
        .append("div")
        .html(
          "The " +
            version +
            " branch of <i>Webcharts</i> loaded as expected. Loading the renderer ..."
        );
      loadRenderer(cat);
    },
    failure: function() {
      cat.statusDiv
        .append("div")
        .html(
          "The " +
            version +
            " branch of Webcharts did NOT load. Aborting chart renderering. Are you sure the specified version exists?"
        )
        .classed("error", true);
    }
  });

  /*
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
*/
}
