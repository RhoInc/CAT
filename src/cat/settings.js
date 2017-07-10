/*------------------------------------------------------------------------------------------------\
  Define controls object.
\------------------------------------------------------------------------------------------------*/

import { makeForm } from "./settings/makeForm";
import { reset } from "./settings/reset";
import { sync } from "./settings/sync";
import { setStatus } from "./settings/setStatus";

export const settings = {
  makeForm: makeForm,
  reset: reset,
  sync: sync,
  setStatus: setStatus
};
