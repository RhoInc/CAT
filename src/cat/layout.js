export function layout(cat) {
  cat.controls.wrap = cat.wrap
    .append("div")
    .attr("class", "cat-controls section");
  cat.chartWrap = cat.wrap.append("div").attr("class", "cat-chart section");
  cat.dataWrap = cat.wrap.append("div").attr("class", "cat-data footer");
}
