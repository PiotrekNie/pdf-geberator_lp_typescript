const bouncerConfig = {
  // Classes & IDs
  fieldClass: 'is-invalid', // Applied to fields with errors
  errorClass: 'invalid-feedback', // Applied to the error message for invalid fields
  fieldPrefix: 'bouncer-field_', // If a field doesn't have a name or ID, one is generated with this prefix
  errorPrefix: 'bouncer-error_', // Prefix used for error message IDs

  // Patterns
  // Validation patterns for specific input types
  patterns: {
    // eslint-disable-next-line no-control-regex,max-len
    email: /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*(\.\w{2,})+$/,
    // eslint-disable-next-line max-len
    url: /^(?:(?:https?|HTTPS?|ftp|FTP):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-zA-Z\u00a1-\uffff0-9]-*)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]-*)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/,
    number: /[-+]?[0-9]*[.,]?[0-9]+/,
    color: /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/,
    // eslint-disable-next-line max-len
    date: /(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))/,
    time: /(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9])/,
    month: /(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2]))/,
  },

  // Message Settings
  messageAfterField: true, // If true, displays error message below field. If false, displays it above.
  messageCustom: 'data-bouncer-message', // The data attribute to use for customer error messages
  messageTarget: 'data-bouncer-target', // The data attribute to pass in a custom selector for the field error location

  // Error messages by error type
  messages: {
    missingValue: {
      checkbox: 'To pole jest wymagane.',
      radio: 'Wybierz wartość.',
      select: 'Wybierz wartość.',
      'select-multiple': 'Zaznacz przynajmniej jedną odpowiedź.',
      default: 'To pole jest wymagane.',
    },
    patternMismatch: {
      email: 'Adres e-mail nieprawidłowy.',
      url: 'URL nieprawidłowy.',
      number: 'Wprowadź liczbę.',
      color: 'Dopasuj do formatu: #rrggbb',
      date: 'Użyj formatu: YYYY-MM-DD',
      time: 'Użyj 24-godzinnego Formatu. Np. 23:00',
      month: 'Użyj formatu: YYYY-MM',
      default: 'Wartość nieprawidłowa.',
    },
    outOfRange: {
      over: 'Maksymalna wartość: {max}.',
      under: 'Minimalna wartość {min}.',
    },
    wrongLength: {
      over: 'Maksymalna długość: {maxLength} znaków. Używasz {length} znaków.',
      under: 'Maksymalna długość to {minLength} znaków. Używasz {length} znaków.',
    },
  },

  // Form Submission
  disableSubmit: true, // If true, native form submission is suppressed even when form validates

  // Custom Events
  emitEvents: true, // If true, emits custom events
};

export default bouncerConfig;
