export function layout(cat){
  cat.controls.wrap = cat.wrap.append("div").attr("class","cat-controls")
  cat.chartWrap = cat.wrap.append("div").attr("class","cat-chart")
  cat.dataWrap = cat.wrap.append("div").attr("class","cat-data")
}
