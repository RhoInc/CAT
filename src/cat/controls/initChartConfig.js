export function initChartConfig(cat) {
  var settingsSection = cat.controls.wrap
    .append("div")
    .attr("class", "control-section");
  var settingsHeading = settingsSection
    .append("h3")
    .html("4. Customize the Chart ");
  cat.controls.settingsRefresh = settingsHeading
    .append("span")
    .html("&#x21bb;")
    .on("click", function() {
      cat.settings.set(cat);
    });

  settingsSection.append("span").text("Settings: ");

  //////////////////////////////////////
  //initialize the config status icon
  //////////////////////////////////////
  cat.controls.settingsStatus = settingsSection
    .append("div")
    .style("font-size", "1.5em")
    .style("float", "right")
    .style("cursor", "pointer");
  settingsSection.append("br");

  //////////////////////////////////////////////////////////////////////
  //radio buttons to toggle between "text" and "form" based settings
  /////////////////////////////////////////////////////////////////////
  cat.controls.settingsTypeText = settingsSection
    .append("input")
    .attr("class", "radio")
    .property("type", "radio")
    .property("name", "settingsType")
    .property("value", "text");
  settingsSection.append("span").text("text");
  cat.controls.settingsTypeForm = settingsSection
    .append("input")
    .attr("class", "radio")
    .property("type", "radio")
    .property("name", "settingsType")
    .property("value", "form");
  settingsSection.append("span").text("form");
  cat.controls.settingsType = settingsSection.selectAll('input[type="radio"]');

  cat.controls.settingsType.on("change", function(d) {
    cat.settings.sync(cat); //first sync the current settings to both views

    //then update to the new view, and update controls.
    cat.current.settingsView = this.value; //
    if (cat.current.settingsView == "text") {
      cat.controls.settingsInput.classed("hidden", false);
      cat.controls.settingsForm.classed("hidden", true);
    } else if (cat.current.settingsView == "form") {
      cat.controls.settingsInput.classed("hidden", true);
      cat.controls.settingsForm.classed("hidden", false);
    }
  });
  settingsSection.append("br");

  //////////////////////////////////////////////////////////////////////
  //text input section
  /////////////////////////////////////////////////////////////////////
  cat.controls.settingsInput = settingsSection
    .append("textarea")
    .attr("rows", 10)
    .style("width", "90%")
    .text("{}");

  //////////////////////////////////////////////////////////////////////
  //wrapper for the form
  /////////////////////////////////////////////////////////////////////
  cat.controls.settingsForm = settingsSection
    .append("div")
    .attr("class", "settingsForm")
    .append("form");

  //set the text/form settings for the first renderer
  cat.settings.set(cat);
}
