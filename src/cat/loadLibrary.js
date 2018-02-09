import { scriptLoader } from "../util/scriptLoader";
import { loadRenderer } from "./loadRenderer";

export function loadLibrary(cat) {
  var version = cat.controls.libraryVersion.node().value;
  var library = "webcharts"; //hardcode to webcharts for now - could generalize later
  var rendererPath =
    cat.config.rootURL +
    "/" +
    library +
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
      cat.status.loadStatus(
        cat.statusDiv,
        true,
        rendererPath,
        library,
        version
      );
      loadRenderer(cat);
    },
    failure: function() {
      cat.status.loadStatus(
        cat.statusDiv,
        false,
        rendererPath,
        library,
        version
      );
    }
  });
}
