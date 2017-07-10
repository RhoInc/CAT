export function initChartConfig(cat) {
  var settingsSection = cat.controls.wrap
    .append("div")
    .attr("class", "control-section");
  settingsSection.append("h3").text("4. Customize the Chart");

  settingsSection.append("span").text("Settings: ");

  cat.controls.settingsStatus = settingsSection
    .append("div")
    .style("font-size", "1.5em")
    .style("float", "right")
    .style("cursor", "pointer");

  cat.settings.setStatus(cat, "no schema");

  settingsSection.append("br");

  settingsSection
    .append("input")
    .attr("class", "radio")
    .property("type", "radio")
    .property("name", "settingsType")
    .property("value", "text")
    .property("checked", !cat.current.schema);
  settingsSection.append("span").text("text");

  settingsSection
    .append("input")
    .attr("class", "radio")
    .property("type", "radio")
    .property("name", "settingsType")
    .property("value", "form")
    .property("checked", cat.current.schema)
    .property("disabled", !cat.current.schema);
  settingsSection.append("span").text("form");

  cat.controls.settingsType = settingsSection.selectAll('input[type="radio"]');

  cat.controls.settingsType.on("change", function(d) {
    cat.settings.sync(cat);
    if (this.value == "text") {
      cat.controls.settingsInput.classed("hidden", false);
      cat.controls.settingsForm.classed("hidden", true);
    } else if (this.value == "form") {
      cat.controls.settingsInput.classed("hidden", true);
      cat.controls.settingsForm.classed("hidden", false);
    }
  });

  settingsSection.append("br");

  cat.controls.settingsInput = settingsSection
    .append("textarea")
    .attr("rows", 10)
    .style("width", "90%")
    .text("{}")
    .classed("hidden", cat.current.schema);

  cat.controls.settingsForm = settingsSection
    .append("div")
    .attr("class", "settingsForm")
    .append("form")
    .classed("hidden", !cat.current.schema);

  if (cat.current.schema) {
    cat.settings.setStatus(cat, "unknown");
    cat.settings.makeForm(cat, null);
  }
}
