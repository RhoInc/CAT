import { initSubmit } from './initSubmit';
import { initRendererSelect } from './initRendererSelect';
import { initDataSelect } from './initDataSelect';
import { initFileLoad } from './initFileLoad';
import { initChartConfig } from './initChartConfig';
import { initEnvConfig } from './initEnvConfig';

export function init() {
    this.current = this.config.renderers[0];
    this.current.version = 'master';
    initSubmit.call(this);
    initRendererSelect.call(this);
    initDataSelect.call(this);
    initFileLoad.call(this);
    initChartConfig.call(this);
    initEnvConfig.call(this);
}
