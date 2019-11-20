import { initSubmit } from './initSubmit';
import { initRendererSelect } from './initRendererSelect';
import { initDataSelect } from './initDataSelect';
import { initFileLoad } from './initFileLoad';
import { initChartConfig } from './initChartConfig';
import { initEnvConfig } from './initEnvConfig';

export function init() {
    console.log(this.config.defaults);
    this.current = this.config.defaults.renderer || this.config.renderers[0];
    console.log(this.current);
    this.current.version = this.config.defaults.version || 'master';
    initSubmit.call(this);
    initRendererSelect.call(this);
    initDataSelect.call(this);
    initFileLoad.call(this);
    initChartConfig.call(this);
    initEnvConfig.call(this);
}
