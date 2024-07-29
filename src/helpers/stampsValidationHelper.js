let validationHandler = null;
let statusFlag = false;

export function createStampsValidateFunction(handler) {
  validationHandler = handler;
}

export function clearStampsValidateFunction() {
  validationHandler = null;
}

export function getStampsValidateFunction() {
  return validationHandler;
}

export function stampsValidationStatus(validationStatus) {
  statusFlag = validationStatus;
}

export function getValidationStatus() {
  return statusFlag;
}