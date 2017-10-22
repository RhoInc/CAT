import { loadBootstrap } from "../loadBootstrap";

export function initBootstrapConfig(cat) {
  var settingsSection = cat.controls.wrap
    .append("div")
    .attr("class", "control-section");
  var settingsHeading = settingsSection.append("h3").html("4. Styling ");

  cat.controls.bootstrapButton = settingsSection
    .append("button")
    .text("Load Bootstrap")
    .on("click", function() {
      loadBootstrap(cat);
    });
  settingsSection
    .append("div")
    .append("small")
    .text(
      "Load bootstrap with the button above. Refresh the page if you want to remove bootstrap."
    );
}
