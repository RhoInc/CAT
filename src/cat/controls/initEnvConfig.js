import { loadCSS } from "../env/loadCSS";
import { loadJS } from "../env/loadJS";
import { resetEnv } from "../env/resetEnv";
import { showEnv } from "../env/showEnv";

export function initEnvConfig(cat) {
  var settingsHeading = cat.controls.environmentWrap
    .append("h3")
    .html("4. Environment ");

  cat.controls.environmentWrap.append("span").text("Environment: ");
  cat.controls.chooseEnv = cat.controls.environmentWrap.append("select");
  cat.controls.chooseEnv
    .selectAll("option")
    .data(cat.config.env)
    .enter()
    .append("option")
    .text(d => d.label);

  cat.controls.chooseEnv.on("change", function() {
    console.log("choosing an environment");
  });

  cat.controls.envReset = cat.controls.environmentWrap
    .append("button")
    .text("Clear Environment")
    .on("click", function() {
      resetEnv(cat);
    });

  cat.controls.cssList = cat.controls.environmentWrap
    .append("ul")
    .attr("class", "cssList");

  cat.controls.jsList = cat.controls.environmentWrap
    .append("ul")
    .attr("class", "jsList");

  showEnv(cat);
}
