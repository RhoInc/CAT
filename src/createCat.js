import init from './cat/init';
import controls from './cat/controls';
import settings from './cat/settings';
import status from './cat/status';

export function createCat(element = 'body', config) {
    const cat = {
        element,
        config,
        init,
        controls,
        settings,
        status
    };

    return cat;
}
