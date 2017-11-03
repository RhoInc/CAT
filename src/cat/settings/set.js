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
  d3.json(schemaPath, function(error, schemaObj) {
    //d3.json(testPath, function(error, schemaObj) {
    if (error) {
      console.log("No schema loaded.");
      cat.current.hasValidSchema = false;
      cat.current.settingsView = "text";
      cat.current.schemaObj = null;
      cat.controls.settingsInput.value = "{}";
      cat.current.config = {};
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
    //set the radio buttons
    cat.controls.settingsTypeText.property(
      "checked",
      cat.current.settingsView == "text"
    );

    cat.controls.settingsTypeForm
      .property("checked", cat.current.settingsView == "form")
      .property("disabled", !cat.current.hasValidSchema);

    // Show/Hide sections
    cat.controls.settingsInput.classed(
      "hidden",
      cat.current.settingsView != "text"
    );
    cat.controls.settingsForm.classed(
      "hidden",
      cat.current.settingsView != "form"
    );
    //update the text or make the schema

    cat.controls.settingsInput.node().value = JSON5.stringify(
      cat.current.config
    );

    if (cat.current.hasValidSchema) {
      console.log("... and it is valid. Making a nice form.");
      makeForm(cat);
    }
  });
}
