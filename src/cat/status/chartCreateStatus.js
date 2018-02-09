export function chartCreateStatus(statusDiv, main, sub) {
  var message = sub
    ? "Created the chart by calling <i>" + main + "." + sub + "()</i>."
    : "Created the chart by calling <i>" + main + "()</i>.";

  statusDiv
    .append("div")
    .html(message)
    .classed("info", true);
}
