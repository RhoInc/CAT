export function initRendererSelect(cat) {
  var rendererSection = cat.controls.wrap
    .append("div")
    .attr("class", "control-section section1");

  rendererSection.append("h3").text("1. Choose a Chart Type");
  cat.controls.rendererSelect = rendererSection.append("select");
  cat.controls.rendererSelect
    .selectAll("option")
    .data(cat.config.renderers)
    .enter()
    .append("option")
    .text(function(d) {
      return d.name;
    });

  cat.controls.rendererSelect.on("change", function(d) {
    cat.current = d3.select(this).select("option:checked").data()[0];
    cat.controls.mainFunction.node().value = cat.current.main;
    cat.controls.subFunction.node().value = cat.current.sub;
    cat.controls.schema.node().value = cat.current.schema;

    cat.controls.settingsType
      .filter(function(d) {
        return this.value == "form";
      })
      .property("disabled", cat.current.schema ? false : "disabled");
  });
}
