import { loadLibrary } from "../loadLibrary";
import addEnterEventListener from "../addEnterEventListener";

export function makeForm(cat, obj) {
  d3.select(".settingsForm form")
    .selectAll("*")
    .remove();

  //define form from settings schema
  cat.current.form = brutusin["json-forms"].create(cat.current.schemaObj);
  //render form
  cat.current.form.render(d3.select(".settingsForm form").node());
  d3.select(".settingsForm form")
    .selectAll(".glyphicon-remove")
    .text("X");
  //get settings object from form
  cat.current.config = cat.current.form.getData();
  //update settings text field to match form
  cat.controls.settingsInput.node().value = JSON.stringify(cat.current.config);

  //handle submission with the "render chart" button
  d3.select(".settingsForm form .form-actions input").remove();
  //format the form a little bit so that we can dodge bootstrap
  d3.selectAll("i.icon-plus-sign").text("+");
  d3.selectAll("i.icon-minus-sign").text("-");

  //add enter listener
  cat.controls.addEnterEventListener(
    cat.controls.wrap.select(".settingsForm"),
    cat
  );

  //jsonform

  //var formLayout = [
  //  {
  //    type: "actions",
  //    items: [
  //      {
  //        type: "submit",
  //        title: "Submit"
  //      }
  //    ]
  //  },
  //  "*"
  //];

  //var myForm = $(".settingsForm form").jsonForm({
  //  schema: cat.current.schemaObj,
  //  value: obj,
  //  form: formLayout,
  //  onSubmit: function(errors, values) {
  //    if (errors) {
  //      if (cat.printStatus) {
  //        cat.statusDiv
  //          .append("div")
  //          .html(
  //            "Attempted to load settings from json-schema form, but there might be a problem ..."
  //          )
  //          .classed("error", true);
  //      }
  //      //cat.settings.setStatus(cat, "invalid");
  //      cat.current.config = values;
  //      cat.controls.settingsInput.node().value = JSON.stringify(
  //        cat.current.config
  //      );
  //    } else {
  //      //cat.settings.setStatus(cat, "valid");
  //      if (cat.printStatus) {
  //        cat.statusDiv
  //          .append("div")
  //          .html("Successfully loaded settings from the json-schema form.")
  //          .classed("success", true);
  //      }
  //      cat.current.config = values;
  //      cat.controls.settingsInput.node().value = JSON.stringify(
  //        cat.current.config
  //      );
  //    }
  //  }
  //});
  //handle submission with the "render chart" button
  //d3.select(".settingsForm form .form-actions input").remove();
  //format the form a little bit so that we can dodge bootstrap
  //d3.selectAll("i.icon-plus-sign").text("+");
  //d3.selectAll("i.icon-minus-sign").text("-");

  //add enter listener
  //cat.controls.addEnterEventListener(
  //  cat.controls.wrap.select(".settingsForm"),
  //  cat
  //);
}
