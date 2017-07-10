import { loadLibrary } from "../loadLibrary";

export function makeForm(cat, obj) {
  var version = cat.controls.versionSelect.node().value;

  var formLayout = [
    {
      type: "actions",
      items: [
        {
          type: "submit",
          title: "Submit"
        }
      ]
    },
    "*"
  ];

  var schemaPath =
    cat.config.rootURL +
    "/" +
    cat.current.name +
    "/" +
    version +
    "/" +
    cat.current.schema;

  var testPath = "../aeexplorer/settings-schema.json";
  //d3.json(schemaPath, function(error, schemaObj) {
  d3.select(".settingsForm form").selectAll("*").remove();
  d3.json(testPath, function(error, schemaObj) {
    var myForm = $(".settingsForm form").jsonForm({
      schema: schemaObj,
      value: obj,
      form: formLayout,
      onSubmit: function(errors, values) {
        if (errors) {
          cat.settings.setStatus(cat, "invalid");
          cat.controls.settingsInput.node().value = JSON.stringify(
            cat.current.config
          );
        } else {
          cat.settings.setStatus(cat, "valid");
          cat.current.config = values;
          cat.controls.settingsInput.node().value = JSON.stringify(
            cat.current.config
          );
        }
      }
    });
    //format the form a little bit so that we can dodge bootstrap
    d3
      .select(".settingsForm form .form-actions input")
      .text("Validate Settings")
      .property("value", "Validate Settings");
    d3.selectAll("i.icon-plus-sign").append("span").text("+");
    d3.selectAll("i.icon-minus-sign").append("span").text("-");

    console.log(myForm);
  });
}
