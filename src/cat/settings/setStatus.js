export function setStatus(cat, statusVal) {
  var statusOptions = [
    {
      key: "valid",
      symbol: "&#x2714;",
      color: "green",
      details: "Settings match the current schema. Click 'Render Chart' to draw the chart."
    },
    {
      key: "invalid",
      symbol: "&#x2718;",
      color: "red",
      details: "Settings do not match the current schema. You can still click 'Render Chart' to try to draw the chart, but it might not work as expected."
    },
    {
      key: "unknown",
      symbol: "?",
      color: "blue",
      details: "You've loaded a schema, but the setting have changed. Click 'Validate Settings' to see if they're valid or you can click 'Render Chart' and see what happens."
    },
    {
      key: "no schema",
      symbol: "NA",
      color: "#999",
      details: "No Schema loaded. Cannot validate the current settings. You can click 'Render Chart' and see what happens."
    }
  ];

  var myStatus = statusOptions.filter(d => d.key == statusVal)[0];

  cat.controls.settingsStatus
    .html(myStatus.symbol)
    .style("color", myStatus.color)
    .attr("title", myStatus.details);
}
