import { loadLibrary } from "../loadLibrary";

export function makeForm(cat, obj) {
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

  d3.select(".settingsForm form").selectAll("*").remove();
  var myForm = $(".settingsForm form").jsonForm({
    schema: cat.current.schemaObj,
    value: obj,
    form: formLayout,
    onSubmit: function(errors, values) {
      if (errors) {
        //cat.settings.setStatus(cat, "invalid");
        cat.current.config = values;
        cat.controls.settingsInput.node().value = JSON.stringify(
          cat.current.config
        );
      } else {
        //cat.settings.setStatus(cat, "valid");
        cat.current.config = values;
        cat.controls.settingsInput.node().value = JSON.stringify(
          cat.current.config
        );
      }
    }
  });
  //handle submission with the "render chart" button
  d3.select(".settingsForm form .form-actions input").remove();
  //format the form a little bit so that we can dodge bootstrap
  d3.selectAll("i.icon-plus-sign").text("+");
  d3.selectAll("i.icon-minus-sign").text("-");
}
