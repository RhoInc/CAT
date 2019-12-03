import { initSubmit } from './initSubmit';
import { initRendererSelect } from './initRendererSelect';
import { initDataSelect } from './initDataSelect';
import { initFileLoad } from './initFileLoad';
import { initChartConfig } from './initChartConfig';
import { initEnvConfig } from './initEnvConfig';

export function init() {
    //initialize UI elements
    initSubmit.call(this);
    initRendererSelect.call(this);
    initDataSelect.call(this);
    initFileLoad.call(this);
    initChartConfig.call(this);
    initEnvConfig.call(this);

    //hide controls/toggle if requested
    if (!this.config.showControls) {
        this.controls.minimize.node().click();

        if (!this.config.showControlsToggle) {
            this.controls.maximize.classed('hidden', true);
        }
    }
}
