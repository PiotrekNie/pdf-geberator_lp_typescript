// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Bouncer from 'formbouncerjs';
import bouncerConfig from './bouncer.config';

class FormValidation {
  public formElement: HTMLFormElement;

  public formValidation: Bouncer = null;

  public initFormValidation(formID: string): void {
    this.formElement = document.querySelector(formID);

    if (!this.formElement) {
      return;
    }

    this.formValidation = new Bouncer(formID, bouncerConfig);

    this.addValidationEventListeners();
  }

  protected bouncerFormValid: (event: Event) => void = (event: Event) => {
    // eslint-disable-next-line no-console
    console.log('bouncerFormValid', event);
  };

  protected bouncerShowError: (event: Event) => void = (event: Event) => {
    if (event.target instanceof Element) {
      event.target.parentElement.classList.remove('form__group--valid');
      event.target.parentElement.classList.add('form__group--invalid');
    }
  };

  protected bouncerRemoveError: (event: Event) => void = (event: Event) => {
    if (event.target instanceof Element) {
      event.target.parentElement.classList.remove('form__group--invalid');
      event.target.parentElement.classList.add('form__group--valid');
    }
  };

  protected bouncerFormInvalid: (event: Event) => void = (event: Event) => {
    // eslint-disable-next-line no-console
    console.log('bouncerFormInvalid', event);
  };

  protected bouncerInitialized: (event: Event) => void = (event: Event) => {
    // eslint-disable-next-line no-console
    console.log('bouncerInitialized', event);
  };

  protected bouncerDestroy: (event: Event) => void = (event: Event) => {
    // eslint-disable-next-line no-console
    console.log('bouncerDestroy', event);
  };

  private addValidationEventListeners(): void {
    this.formElement.addEventListener('bouncerShowError', this.bouncerShowError);
    this.formElement.addEventListener('bouncerRemoveError', this.bouncerRemoveError);
    this.formElement.addEventListener('bouncerFormValid', this.bouncerFormValid);
    this.formElement.addEventListener('bouncerFormInvalid', this.bouncerFormInvalid);
    this.formElement.addEventListener('bouncerInitialized', this.bouncerInitialized);
    this.formElement.addEventListener('bouncerDestroy', this.bouncerDestroy);
  }
}

export default FormValidation;
