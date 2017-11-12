export function loadStatus(statusDiv, passed, path, library, version) {
  var message = passed
    ? "Successfully loaded " + path
    : "Failed to load " + path;

  if ((library != undefined) & (version != undefined))
    message = message + " (Library: " + library + ", Version: " + version + ")";

  statusDiv
    .append("div")
    .html(message)
    .classed("error", !passed);
}
