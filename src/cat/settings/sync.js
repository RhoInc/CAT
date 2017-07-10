export function sync(cat) {
  var settingType = cat.controls.settingsType
    .filter(function(d) {
      return d3.select(this).property("checked");
    })
    .node().value;

  // set current config
  if (settingType == "text") {
    cat.current.config = JSON.parse(cat.controls.settingsInput.node().value);
    cat.settings.makeForm(cat, cat.current.config);
  } else if (settingType == "form") {
    //this submits the form (thus saving the most recent object)
    $(".settingsForm form").trigger("submit");
  }
}
