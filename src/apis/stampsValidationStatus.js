/**
 * Set boolean parameter to make sure of validation of stamps
 * @method UI.stampsValidationStatus
 * @param {UI.stampsValidationStatus} boolean parameter
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.stampsValidationStatus(true);
  });
 */
/**
 * Callback that gets passed to {@link UI.stampsValidationStatus setValidationStatus}.
 * @callback UI.stampsValidationStatus
 * @param {boolean} stampsValidationStatus stampsValidationStatus
 */

import { stampsValidationStatus as setValidationStatus } from 'helpers/stampsValidationHelper';

export default (store) => (validationStatus) => {
  setValidationStatus(validationStatus);
}