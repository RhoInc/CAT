export function chartInitStatus(statusDiv, success, err, htmlExport) {
  if (success) {
    //hide all non-error statuses
    statusDiv.selectAll("div:not(.error)").classed("hidden", true);

    // Print basic success message
    statusDiv
      .append("div")
      .attr("class", "initSuccess")
      .html(
        "All Done. Your chart should be below. <span class='showLog'>Show full log</span>"
      )
      .classed("info", true);

    //Click to show all statuses
    statusDiv
      .select("div.initSuccess")
      .select("span.showLog")
      .style("cursor", "pointer")
      .style("text-decoration", "underline")
      .style("float", "right")
      .on("click", function() {
        d3.select(this).remove();
        statusDiv.selectAll("div").classed("hidden", false);
      });

    //generic caution (hidden by default)
    statusDiv
      .append("div")
      .classed("hidden", true)
      .classed("info", true)
      .html(
        "&#9432; Just because there are no errors doesn't mean there can't be problems. If things look strange, it might be a problem with the settings/data combo or with the renderer itself."
      );

    //export source code (via copy/paste)
    statusDiv
      .append("div")
      .classed("hidden", true)
      .classed("export", true)
      .classed("minimized", true)
      .html("Click to see chart's full source code");

    statusDiv.select("div.export.minimized").on("click", function() {
      d3.select(this).classed("minimized", false);
      d3.select(this).html("<strong>Source code for chart:</strong>");
      d3.select(this)
        .append("code")
        .html(
          htmlExport
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\n/g, "<br/>")
            .replace(/ /g, "&nbsp;")
        );
    });
  } else {
    //if init fails (success == false)
    statusDiv
      .append("div")
      .html(
        "There might've been some problems initializing the chart. Errors include:<br><small><i>" +
          err +
          "</i></small>"
      )
      .classed("error", true);
  }
}
