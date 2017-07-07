export function makeSettingsForm(cat) {
  console.log("settings form is coming atcha");

  var version = cat.controls.versionSelect.node().value;
  var schemaPath =
    cat.config.rootURL +
    "/" +
    cat.current.name +
    "/" +
    version +
    "/" +
    cat.current.schema;

  var testPath = "../aeexplorer/settings-schema.json";
  console.log(schemaPath);
  //d3.json(schemaPath, function(error, schemaObj) {
  d3.json(testPath, function(error, schemaObj) {
    console.log(schemaObj);
    $(".settingsForm form").jsonForm({
      schema: schemaObj,
      onSubmit: function(errors, values) {
        console.log("clicked");
        if (errors) {
          console.log("Boo :(");
          console.log(errors);
        } else {
          console.log("yay :)");
          console.log(values);
        }
      }
    });
  });
}
