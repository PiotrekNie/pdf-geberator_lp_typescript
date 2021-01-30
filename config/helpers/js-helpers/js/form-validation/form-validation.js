// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Bouncer from 'formbouncerjs';
import bouncerConfig from './bouncer.config';

class FormValidation {
  /**
   * @public
   * @type {HTMLFormElement}
   */
  formElement;

  /**
   * @public
   * @type {Bouncer}
   */
  formValidation = null;

  /**
   *
   * @param {string} formID
   */
  initFormValidation(formID) {
    this.formElement = document.querySelector(formID);

    if (!this.formElement) {
      return;
    }

    this.formValidation = new Bouncer(formID, bouncerConfig);

    this.addValidationEventListeners();
  }

  /**
   * @protected
   *
   * @param {Event} event
   */
  bouncerFormValid = (event) => {
    // eslint-disable-next-line no-console
    console.log('bouncerFormValid', event);
  };

  /**
   * @protected
   *
   * @param {Event} event
   */
  bouncerShowError = (event) => {
    if (event.target instanceof Element) {
      event.target.parentElement.classList.remove('form__group--valid');
      event.target.parentElement.classList.add('form__group--invalid');
    }
  };

  /**
   * @protected
   *
   * @param {Event} event
   */
  bouncerRemoveError = (event) => {
    if (event.target instanceof Element) {
      event.target.parentElement.classList.remove('form__group--invalid');
      event.target.parentElement.classList.add('form__group--valid');
    }
  };

  /**
   * @protected
   *
   * @param {Event} event
   */
  bouncerFormInvalid = (event) => {
    // eslint-disable-next-line no-console
    console.log('bouncerFormInvalid', event);
  };

  /**
   * @protected
   *
   * @param {Event} event
   */
  bouncerInitialized = (event) => {
    // eslint-disable-next-line no-console
    console.log('bouncerInitialized', event);
  };

  /**
   * @protected
   *
   * @param {Event} event
   */
  bouncerDestroy = (event) => {
    // eslint-disable-next-line no-console
    console.log('bouncerDestroy', event);
  };

  /**
   * @private
   */
  addValidationEventListeners() {
    this.formElement.addEventListener('bouncerShowError', this.bouncerShowError);
    this.formElement.addEventListener('bouncerRemoveError', this.bouncerRemoveError);
    this.formElement.addEventListener('bouncerFormValid', this.bouncerFormValid);
    this.formElement.addEventListener('bouncerFormInvalid', this.bouncerFormInvalid);
    this.formElement.addEventListener('bouncerInitialized', this.bouncerInitialized);
    this.formElement.addEventListener('bouncerDestroy', this.bouncerDestroy);
  }
}

export default FormValidation;
