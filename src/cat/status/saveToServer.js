export function saveToServer(cat) {
  var serverDiv = cat.statusDiv
    .append("div")
    .attr("class", "info")
    .text("Enter your name and click save for a reusable URL. ");
  var nameInput = serverDiv.append("input").property("placeholder", "Name");
  var saveButton = serverDiv
    .append("button")
    .text("Save")
    .property("disabled", true);

  nameInput.on("input", function() {
    saveButton.property("disabled", nameInput.node().value.length == 0);
  });

  saveButton.on("click", function() {
    //remove the form
    d3.select(this).remove();
    nameInput.remove();

    //format an object for the post
    var dataFile = cat.controls.dataFileSelect.node().value;
    var dataFilePath = cat.config.dataURL + dataFile;
    var chartObj = {
      name: nameInput.node().value,
      renderer: cat.current.name,
      version: cat.controls.versionSelect.node().value,
      dataFile: dataFilePath,
      chart: btoa(cat.current.htmlExport)
    };

    //post the object, get a URL back
    $.post("./export/", chartObj, function(data) {
      serverDiv.html(
        "Chart saved as <a href='" + data.url + "'>" + data.url + "</a>"
      );
    }).fail(function() {
      serverDiv.text("Sorry. Couldn't save the chart.").classed("error", true);
      console.warn("Error :( Something went wrong saving the chart.");
    });
  });
}
