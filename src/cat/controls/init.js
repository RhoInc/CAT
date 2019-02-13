import { initSubmit } from './initSubmit';
import { initRendererSelect } from './initRendererSelect';
import { initDataSelect } from './initDataSelect';
import { initFileLoad } from './initFileLoad';
import { initChartConfig } from './initChartConfig';
import { initEnvConfig } from './initEnvConfig';

export function init(cat) {
    cat.current = cat.config.renderers[0];
    cat.current.version = 'master';
    initSubmit(cat);
    initRendererSelect(cat);
    initDataSelect(cat);
    initFileLoad.call(cat);
    initChartConfig(cat);
    initEnvConfig(cat);
}
