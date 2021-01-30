/**
 * @class GoogleRecaptcha - https://developers.google.com/recaptcha/docs/v3
 * @param {string} siteKey - unique site key for Google Recaptcha
 * @param {string} [somebody=g-recaptcha-response] inputName - name of the input to store the token
 *
 * Before initialization, make sure you add the <script> tag with the same siteKey
 * <script src="https://www.google.com/recaptcha/api.js?render=siteKey"></script>
 *
 */

/* global grecaptcha */

class GoogleRecaptcha {
  /**
   * @type {string}
   */
  inputName;

  /**
   * @type {string}
   */
  siteKey;

  /**
   *
   * @param {string} siteKey
   * @param {string} [inputName=g-recaptcha-response] captchaName
   */
  constructor(siteKey, inputName = 'g-recaptcha-response') {
    this.siteKey = siteKey;
    this.inputName = inputName || this.inputName;
  }

  /**
   *
   * @static
   * @return {Promise<boolean>}
   */
  static async ready() {
    return new Promise((resolve) => {
      grecaptcha.ready(() => {
        resolve(true);
      });
    });
  }

  /**
   *
   * @public
   * @param {HTMLFormElement} form - The form element to which the token should be added
   * @param {string} token - Google Recaptcha token
   *
   * Create or update an input field with a Google Recaptcha token
   */
  createTokenInput = (form, token) => {
    /**
     *
     * @type {HTMLInputElement}
     */
    let tokenInput = form.querySelector(`[name='${this.inputName}']`);

    if (tokenInput instanceof HTMLInputElement) {
      tokenInput.value = token;
    } else {
      tokenInput = document.createElement('input');
      tokenInput.type = 'hidden';
      tokenInput.value = token;
      tokenInput.name = this.inputName;

      form.appendChild(tokenInput);
    }
  };

  /**
   *
   * @public
   *
   * @param {string} [action=submit] action
   * @return {PromiseLike<string>}
   *
   * This method returns the promise of Google Recaptcha token.
   * The token must be verified in the backend.
   */
  async execute(action = 'submit') {
    await GoogleRecaptcha.ready();
    return grecaptcha.execute(this.siteKey, { action });
  }

  /**
   *
   * @public
   * @param {HTMLFormElement} form - The form you want to verify the Google Recaptcha
   * @return Promise<string> - Returns the promise of Google Recaptcha token.
   *
   * This method will automatically create an input to store the Google Recaptcha token
   */
  async submit(form) {
    /**
     *
     * @type {string}
     */
    const token = await this.execute();

    return new Promise((resolve) => {
      this.createTokenInput(form, token);

      resolve(token);
    });
  }
}

export default GoogleRecaptcha;
