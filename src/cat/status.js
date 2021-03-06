/*------------------------------------------------------------------------------------------------\
  Define controls object.
\------------------------------------------------------------------------------------------------*/

import { chartCreateStatus } from './status/chartCreateStatus';
import { chartInitStatus } from './status/chartInitStatus';
import { saveToServer } from './status/saveToServer';
import { loadStatus } from './status/loadStatus';

export const status = {
    chartCreateStatus: chartCreateStatus,
    chartInitStatus: chartInitStatus,
    saveToServer: saveToServer,
    loadStatus: loadStatus
};
