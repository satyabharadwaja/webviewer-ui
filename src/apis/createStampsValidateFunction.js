/**
 * Set save as handler that will be triggered in case of a save action instead of the default method.
 * @method UI.createStampsValidateFunction
 * @param {UI.createStampsValidateFunction} handler Callback function that will be triggered when stamps gets created
 * @example
WebViewer(...)
  .then(function(instance) {
    function stampValidationHandler(stamp) {
      console.log(stamp);
    };

    instance.UI.createStampsValidateFunction(stampValidationHandler);
  });
 */
/**
 * Callback that gets passed to {@link UI.createStampsValidateFunction createStampsValidateFunction}.
 * @callback UI.createStampsValidateFunction
 * @param {stamp} data data
 */

import { createStampsValidateFunction as addStampsCreationValidationHandler } from 'helpers/stampsValidationHelper';

export default (store) => (handler) => {
  addStampsCreationValidationHandler(handler);
};
