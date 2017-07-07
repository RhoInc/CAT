import { init } from "./cat/init";
import { layout } from "./cat/layout";
import { controls } from "./cat/controls";
import { setDefaults } from "./cat/setDefaults";
import { makeSettingsForm } from "./cat/makeSettingsForm";

export function createCat(element = "body", config) {
  let cat = {
    element: element,
    config: config,
    init: init,
    layout: layout,
    controls: controls,
    setDefaults: setDefaults,
    makeSettingsForm: makeSettingsForm
  };

  return cat;
}
