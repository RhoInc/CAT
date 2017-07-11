import { initRendererSelect } from "./initRendererSelect";
import { initRendererConfig } from "./initRendererConfig";
import { initDataSelect } from "./initDataSelect";
import { initChartConfig } from "./initChartConfig";
import { initSubmit } from "./initSubmit";

export function init(cat) {
  cat.current = cat.config.renderers[0];
  cat.controls.wrap.append("h2").text("Charting Application Tester 😼");
  initSubmit(cat);
  initRendererSelect(cat);
  initRendererConfig(cat);
  initDataSelect(cat);
  initChartConfig(cat);

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
