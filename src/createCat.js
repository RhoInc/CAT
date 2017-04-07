import { init } from './cat/init';
import { layout } from './cat/layout';
import { controls } from './cat/controls';
import { setDefaults } from './cat/setDefaults';

export function createCat(element = 'body', config) {
    let cat =
        {element: element
        ,config:  config
        ,init: init
        ,layout: layout
        ,controls:controls
        ,setDefaults:setDefaults
      };

    return cat;
}
