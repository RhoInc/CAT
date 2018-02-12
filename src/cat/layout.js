export function layout(cat) {
  /* Layout primary sections */
  cat.controls.wrap = cat.wrap
    .append("div")
    .attr("class", "cat-controls section");
  cat.chartWrap = cat.wrap.append("div").attr("class", "cat-chart section");
  cat.dataWrap = cat.wrap.append("div").attr("class", "cat-data footer");

  /* Layout CAT Controls Divs */
  cat.controls.submitWrap = cat.controls.wrap
    .append("div")
    .attr("class", "control-section submit-section");

  cat.controls.rendererWrap = cat.controls.wrap
    .append("div")
    .attr("class", "control-section renderer-section");

  cat.controls.dataWrap = cat.controls.wrap
    .append("div")
    .attr("class", "control-section data-section");

  cat.controls.settingsWrap = cat.controls.wrap
    .append("div")
    .attr("class", "control-section settings-section");

  cat.controls.environmentWrap = cat.controls.wrap
    .append("div")
    .attr("class", "control-section environment-section");
}
