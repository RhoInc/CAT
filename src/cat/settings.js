/*------------------------------------------------------------------------------------------------\
  Define controls object.
\------------------------------------------------------------------------------------------------*/

import { set } from './settings/set';
import { sync } from './settings/sync';
import { setStatus } from './settings/setStatus';

export const settings = {
    set: set,
    sync: sync,
    setStatus: setStatus
};
