import { scriptLoader } from "../util/scriptLoader";
import { loadRenderer } from "./loadRenderer";

export function loadBootstrap(cat) {
  var bootstrapPath_css =
    "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css";
  var bootstrapPath_js =
    "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js";

  var link = document.createElement("link");
  link.href = bootstrapPath_css;
  link.type = "text/css";
  link.rel = "stylesheet";
  document.getElementsByTagName("head")[0].appendChild(link);

  var bootstrapLoader = new scriptLoader();
  bootstrapLoader.require(bootstrapPath_js, {
    async: true,
    success: function() {
      cat.statusDiv.append("div").html("Loaded bootstrap.");

      loadRenderer(cat);
    },
    failure: function() {
      cat.statusDiv
        .append("div")
        .html("The " + version + "Couldn't load bootstrap. Aborting.")
        .classed("error", true);
    }
  });
}
