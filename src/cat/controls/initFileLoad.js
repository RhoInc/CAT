export function initFileLoad() {
  var cat = this;
  //draw the control

  cat.controls.dataFileLoad = cat.controls.dataWrap
    .append("input")
    .attr("type", "file")
    .attr("class", "file-load-input");
  cat.controls.dataFileLoadButton = cat.controls.dataWrap
    .append("button")
    .text("Load File")
    .attr("class", "file-load-button")
    .on("click", function(d) {
      //credit to https://jsfiddle.net/Ln37kqc0/
      var files = cat.controls.dataFileLoad.node().files;
      if (files.length <= 0) {
        console.log("No file selected ...");
        return false;
      }

      var fr = new FileReader();
      fr.onload = function(e) {
        //make sure the file is a csv

        //make an object for the file
        var dataObject = {
          label: files[0].name + " (loaded by user)",
          user_loaded: true,
          csv_raw: e.target.result
        };
        cat.config.dataFiles.push(dataObject);

        //add it to the select dropdown
        cat.controls.dataFileSelect
          .append("option")
          .datum(dataObject)
          .text(d => d.label);

        //let the user know that it's been added
      };

      fr.readAsText(files.item(0));
    });
}
