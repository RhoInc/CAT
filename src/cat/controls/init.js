import { initRendererSelect } from "./initRendererSelect";
import { initDataSelect } from "./initDataSelect";
import { initFileLoad } from "./initFileLoad";
import { initChartConfig } from "./initChartConfig";
import { initEnvConfig } from "./initEnvConfig";
import { initSubmit } from "./initSubmit";
import addEnterEventListener from '../addEnterEventListener';

export function init(cat) {
  cat.current = cat.config.renderers[0];
  initSubmit(cat);
  initRendererSelect(cat);
  initDataSelect(cat);
  initFileLoad.call(cat);
  initChartConfig(cat);
  initEnvConfig(cat);
  addEnterEventListener(cat);

  // minimize controls - for later?
  /*
  cat.controls.minimize = controlWrap
    .append("div")
    .attr("class", "minimize")
    .text("<<")
    .style("float", "left")
    .on("click", function() {
      cat.controls.wrap.classed("hidden", true);
      cat.wrap
        .insert("div", ":first-child")
        .attr("class", "maximize")
        .text(">>")
        .on("click", function() {
          cat.controls.wrap.classed("hidden", false);
          d3.select(this).remove();
        });
    });
*/
}
