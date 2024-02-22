import { setCheckPasswordFunction } from 'components/PasswordModal';
import core from 'core';
import { fireError } from 'helpers/fireEvent';
import getHashParameters from 'helpers/getHashParameters';
import actions from 'actions';
import DataElements from 'constants/dataElement';
import FeatureFlags from 'constants/featureFlags';


export default (dispatch, src, options = {}, documentViewerKey = 1) => {
  const isCustomizableUIEnabled = getHashParameters('ui', 'default') === 'beta';

  core.closeDocument(documentViewerKey);
  options = { ...getDefaultOptions(), ...options };

  options.docId = options.docId || options.documentId || null;
  const customLoadingProgressFunction = options.onLoadingProgress;
  options.onLoadingProgress = (percent) => {
    customLoadingProgressFunction && customLoadingProgressFunction(percent);
    dispatch(actions.setLoadingProgress(percent));
  };
  options.password = transformPasswordOption(options.password, dispatch);
  options.xodOptions = extractXodOptions(options);
  if ('onError' in options) {
    const userDefinedOnErrorCallback = options.onError;
    options.onError = function(error) {
      fireError(error);
      userDefinedOnErrorCallback(error);
    };
  } else {
    options.onError = fireError;
  }

  dispatch(actions.closeElement(DataElements.PASSWORD_MODAL));

  if (options.enableOfficeEditing && isCustomizableUIEnabled) {
    dispatch(actions.disableFeatureFlag(FeatureFlags.CUSTOMIZABLE_UI));
  }

  if (options.enableOfficeEditing && !src) {
    core.loadBlankOfficeEditorDocument(options);
  } else {
    // ignore caught errors because they are already being handled in the onError callback
    core.loadDocument(src, options, documentViewerKey).catch(() => {});
  }

  dispatch(actions.openElement(DataElements.PROGRESS_MODAL));
};


/**
 * Default options are some of the options used to initialize WebViewer, and will be preserved on loadDocument calls.
 * We do this so that users don't need to pass these options every time they call instance.loadDocument
 * For example, if WebViewer is initialized with WebViewer Server, subsequent calls to instance.loadDocument will assume WebViewer Server is used.
 * @ignore
 */
const getDefaultOptions = () => ({
  startOffline: getHashParameters('startOffline', false),
  azureWorkaround: getHashParameters('azureWorkaround', false),
  webviewerServerURL: getHashParameters('webviewerServerURL', ''),
  fallbackToClientSide: getHashParameters('fallbackToClientSide', false),
  singleServerMode: getHashParameters('singleServerMode', false),
  forceClientSideInit: getHashParameters('forceClientSideInit', false),
  disableWebsockets: getHashParameters('disableWebsockets', false),
  cacheKey: getHashParameters('cacheKey', null),
  officeOptions: JSON.parse(getHashParameters('officeOptions', null)),
  rasterizerOptions: JSON.parse(getHashParameters('rasterizerOptions', null)),
  streaming: getHashParameters('streaming', null),
  useDownloader: getHashParameters('useDownloader', true),
  backendType: getHashParameters('pdf', null),
  loadAsPDF: getHashParameters('loadAsPDF', null),
  enableOfficeEditing: getHashParameters('enableOfficeEditing', false),
});

/**
 * transform the password argument from a string to a function to hook up UI logic
 * @ignore
 */
const transformPasswordOption = (password, dispatch) => {
  // a boolean that is used to prevent infinite loop when wrong password is passed as an argument
  let passwordChecked = false;
  let attempt = 0;

  return (checkPassword) => {
    dispatch(actions.setPasswordAttempts(attempt++));

    if (!passwordChecked && typeof password === 'string') {
      checkPassword(password);
      passwordChecked = true;
    } else {
      if (passwordChecked) {
        console.error(
          'Wrong password has been passed as an argument. WebViewer will open password modal.',
        );
      }

      setCheckPasswordFunction(checkPassword);
      dispatch(actions.openElement(DataElements.PASSWORD_MODAL));
    }
  };
};

const extractXodOptions = (options) => {
  const xodOptions = options.xodOptions || {};

  if (options.decryptOptions) {
    xodOptions.decrypt = window.Core.Encryption.decrypt;
    xodOptions.decryptOptions = options.decryptOptions;
  }

  if (options.decrypt) {
    xodOptions.decrypt = options.decrypt;
  }

  if (options.streaming !== null) {
    // depending on combination of value in loadDocument and in WV constructor
    // getHashedParam will either return back a boolean or a stringed boolean value
    xodOptions.streaming = options.streaming === 'true' || options.streaming === true;
  }

  if (options.azureWorkaround) {
    xodOptions.azureWorkaround = options.azureWorkaround;
  }

  if (options.startOffline) {
    xodOptions.startOffline = options.startOffline;
  }

  return xodOptions;
};
