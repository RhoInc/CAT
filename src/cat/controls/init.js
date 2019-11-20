import { initSubmit } from './initSubmit';
import { initRendererSelect } from './initRendererSelect';
import { initDataSelect } from './initDataSelect';
import { initFileLoad } from './initFileLoad';
import { initChartConfig } from './initChartConfig';
import { initEnvConfig } from './initEnvConfig';

export function init() {
    //set values for initial renderer
    console.log(this.config.fromURL);
    this.current = this.config.fromURL.renderer || this.config.renderers[0];
    this.current.version = this.config.fromURL.version || 'master';
    this.current.defaultData = this.config.fromURL.data || this.current.defaultData;
    this.current.config = this.config.fromURL.settings || {};
    console.log(this.current);

    //initialize UI elements
    initSubmit.call(this);
    initRendererSelect.call(this);
    initDataSelect.call(this);
    initFileLoad.call(this);
    initChartConfig.call(this);
    initEnvConfig.call(this);
}
