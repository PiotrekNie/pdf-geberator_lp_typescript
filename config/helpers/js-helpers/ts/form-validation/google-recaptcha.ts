/**
 * @class GoogleRecaptcha - https://developers.google.com/recaptcha/docs/v3
 * @param {string} siteKey - unique site key for Google Recaptcha
 * @param {string} inputName - name of the input to store the token
 *
 * Before initialization, make sure you add the <script> tag with the same siteKey
 * <script src="https://www.google.com/recaptcha/api.js?render=siteKey"></script>
 *
 */
class GoogleRecaptcha {
  private readonly inputName: string = 'g-recaptcha-response';

  private readonly siteKey: string;

  constructor(siteKey: string, captchaName?: string) {
    this.siteKey = siteKey;
    this.inputName = captchaName || this.inputName;
  }

  private static async ready(): Promise<boolean> {
    return new Promise((resolve: (value: boolean | PromiseLike<boolean>) => void) => {
      grecaptcha.ready(() => {
        resolve(true);
      });
    });
  }

  /**
   *
   * @param {HTMLFormElement} form - The form element to which the token should be added
   * @param {string} token - Google Recaptcha token
   *
   * Create or update an input field with a Google Recaptcha token
   */
  public createTokenInput: (form: HTMLFormElement, token: string) => void = (form: HTMLFormElement, token: string) => {
    let tokenInput: HTMLInputElement = form.querySelector(`[name='${this.inputName}']`);

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
   * This method returns the promise of Google Recaptcha token.
   * The token must be verified in the backend.
   */
  public async execute(action: string = 'submit'): Promise<string> {
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
  public async submit(form: HTMLFormElement): Promise<string> {
    const token: string = await this.execute();

    return new Promise((resolve: (value: string | PromiseLike<string>) => void) => {
      this.createTokenInput(form, token);

      resolve(token);
    });
  }
}

export default GoogleRecaptcha;
