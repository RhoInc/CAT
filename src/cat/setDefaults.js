import defaultSettings from "./defaultSettings";

export function setDefaults(cat) {
  cat.config = defaultSettings; // just ignore the user settings for the moment. Will set up merge later.
}
