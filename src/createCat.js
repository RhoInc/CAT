import { init } from "./cat/init";
import { layout } from "./cat/layout";
import { controls } from "./cat/controls";
import { setDefaults } from "./cat/setDefaults";
import { settings } from "./cat/settings";
import { status } from "./cat/status";

export function createCat(element = "body", config) {
  let cat = {
    element: element,
    config: config,
    init: init,
    layout: layout,
    controls: controls,
    setDefaults: setDefaults,
    settings: settings,
    status: status
  };

  return cat;
}
