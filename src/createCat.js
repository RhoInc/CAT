import { init } from './cat/init';
import { settings } from './cat/settings';
import { status } from './cat/status';
import { controls } from './cat/controls';

export function createCat(element = 'body', config) {
    let cat = {
        element: element,
        config: config,
        init: init,
        controls: controls,
        settings: settings,
        status: status
    };

    return cat;
}
