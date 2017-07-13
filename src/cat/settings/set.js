import { makeForm } from "./makeForm";
import { setStatus } from "./setStatus";
import { validateSchema } from "./validateSchema";

export function set(cat) {
  // load the schema (if any) and see if it is validate
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
  d3.json(schemaPath, function(error, schemaObj) {
    //d3.json(testPath, function(error, schemaObj) {
    if (error) {
      console.log("No schema loaded.");
      cat.current.hasValidSchema = false;
      cat.current.settingsView = "text";
      cat.current.schemaObj = null;
      //cat.settings.setStatus(cat, "no schema");
    } else {
      // attempt to validate the schema
      console.log("Schema found ...");
      cat.current.hasValidSchema = validateSchema(schemaObj);
      cat.current.settingsView = cat.current.hasValidSchema ? "form" : "text";
      cat.current.schemaObj = cat.current.hasValidSchema ? schemaObj : null;
      //  cat.settings.setStatus(
      //    cat,
      //    cat.current.hasValidSchema ? "unknown" : "no schema"
      //  );
    }
    console.log(cat.current);
    //set the radio buttons
    cat.controls.settingsTypeText.property(
      "checked",
      cat.current.settingsView == "text"
    );

    cat.controls.settingsTypeForm
      .property("checked", cat.current.settingsView == "form")
      .property("disabled", !cat.current.hasValidSchema);

    // Show/Hide sections
    console.log(cat.current.settingsView);
    cat.controls.settingsInput.classed(
      "hidden",
      cat.current.settingsView != "text"
    );
    cat.controls.settingsForm.classed(
      "hidden",
      cat.current.settingsView != "form"
    );

    if (cat.current.hasValidSchema) {
      console.log("... and it is valid. Making a nice form.");
      makeForm(cat);
    }
  });
}
