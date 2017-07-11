import { makeForm } from "./makeForm";

export function sync(cat) {
  // set current config
  if (cat.current.settingsView == "text") {
    cat.current.config = JSON.parse(cat.controls.settingsInput.node().value);
    if (cat.current.hasValidSchema) {
      makeForm(cat, cat.current.config);
    }
  } else if (cat.current.settingsView == "form") {
    //this submits the form which:
    //- saves the current object
    //- updates the hidden text view
    $(".settingsForm form").trigger("submit");
  }
}
