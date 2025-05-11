/**
 * Throttle function decorator
 * @param {Function} func - Function to throttle
 * @param {number} delay - Throttle delay in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, delay = 100) {
  let lastCall = 0;
  let timeoutId;

  return function (...args) {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;

    clearTimeout(timeoutId);

    if (timeSinceLastCall >= delay) {
      func.apply(this, args);
      lastCall = now;
    } else {
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastCall = Date.now();
      }, delay - timeSinceLastCall);
    }
  };
}

/**
 * Collection of validation rule functions
 * @namespace
 * @property {Function} required - Required field validator
 * @property {Function} email - Email format validator
 */
const ruleFunctions = {
  required: (val) => !!val,
  email: (val) => {
    const regex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return regex.test(val);
  },
};

/**
 * Collection of validation error messages
 * @namespace
 * @property {string} required - Required field message
 * @property {string} email - Invalid email message
 */
const ruleMessages = {
  required: 'Field is required',
  email: 'Invalid E-mail',
};

/**
 * Creates and appends an error message element to the specified wrapper
 * @param {string} message - The error message to display
 * @param {HTMLElement} wrapper - The parent element where the error will be inserted
 * @returns {void}
 */
const createInputError = (message, wrapper) => {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-div';
  errorDiv.textContent = message;

  wrapper.appendChild(errorDiv);
};

/**
 * Removes an error message element from the DOM
 * @param {HTMLElement} el - The error element to remove
 * @returns {void}
 */
const deleteInputError = (el) => {
  if (!el) return;

  el.remove();
};

/**
 * Removes error div element from the DOM
 * @param {HTMLElement} input - The error element to remove
 * @returns {void}
 */
const clearValidationInput = (input) => {
  const wrapper = input.closest('.validate-wrapper');
  const errorDiv = wrapper.querySelector('.error-div');
  if (wrapper && errorDiv) {
    deleteInputError(errorDiv);
    input.classList.remove('invalid');
  }
};

/**
 * Validates all form inputs with validation-rules attribute
 * @param {HTMLFormElement} form - The form element to validate
 * @returns {boolean} True if form is invalid (contains errors)
 */
const validate = (form) => {
  const validationInputs = form.querySelectorAll('input[validation-rules]');
  const invalidInputs = [];

  [...validationInputs].forEach((input) => {
    clearValidationInput(input);
    const value = input.type === 'checkbox' ? input.checked : input.value;
    const rules = input.getAttribute('validation-rules').split('|');
    let foreachBreak = false;

    rules.forEach((rule) => {
      if (foreachBreak) return;

      const ruleFunction = ruleFunctions[rule];
      if (ruleFunction && !ruleFunction(value)) {
        invalidInputs.push({
          el: input,
          message: ruleMessages[rule],
        });
        foreachBreak = true;
      }
    });
  });

  invalidInputs.forEach(({ el: input, message }) => {
    const wrapper = input.closest('.validate-wrapper');
    if (wrapper) {
      wrapper.classList.add('not-valid');
      createInputError(message, wrapper);
      input.classList.add('invalid');
    }
  });

  return !invalidInputs.length;
};

/**
 * Initializes live validation for all forms with 'validate-form' class.
 * Attaches change event listeners to inputs with validation rules to automatically
 * clear error states when user modifies the input.
 * @function initValidate
 * @returns {void}
 */
const validateInit = () => {
  const formsWithValidate = document.querySelectorAll('.validate-form');

  [...formsWithValidate].forEach((form) => {
    const inputs = form.querySelectorAll('input[validation-rules]');
    [...inputs].forEach((input) => {
      const wrapper = input.closest('.validate-wrapper');
      input.addEventListener('input', () => {
        const errorDiv = wrapper.querySelector('.error-div');
        deleteInputError(errorDiv);
        input.classList.remove('invalid');
      });
    });
  });
};

/**
 * Finds and returns the first DOM element with class 'overlay'.
 * @returns {HTMLElement|null}
 */
const getOverlay = () => {
  return document.querySelector('.overlay');
};

/**
 * Toggles the 'active' class on the overlay element.
 * @returns {void}
 */
const toggleOverlay = () => {
  const overlay = getOverlay();

  if (!overlay) return;

  overlay.classList.toggle('active');
};

/**
 * Toggles scroll locking on the document body..
 * @returns {void}
 */
const toggleBodyScroll = () => {
  document.body.classList.toggle('disable-scroll');
};

export {
  throttle,
  validate,
  validateInit,
  getOverlay,
  toggleOverlay,
  toggleBodyScroll,
};
