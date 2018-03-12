import { loadBootstrap } from "../loadBootstrap";

export function initBootstrapConfig(cat) {
  var settingsHeading = cat.controls.environmentWrap
    .append("h3")
    .html("4. Environment ");

  cat.controls.bootstrapButton = cat.controls.environmentWrap
    .append("button")
    .text("Load Bootstrap")
    .on("click", function() {
      loadBootstrap(cat);
    });

  cat.controls.environmentWrap
    .append("div")
    .append("small")
    .text(
      "Load bootstrap with the button above. Refresh the page if you want to remove bootstrap."
    );
}
