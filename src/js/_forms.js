import { validate } from './_helpers';

// Settings vars
const successMessage = 'The form was sent successfully';
const successBlockClass = 'success-block';
const formSuccessClass = 'success';
const loadingClass = 'loading';
const catchMessage = 'Something went wrong, please try again';
const catchBlockClass = 'error-block';
const catchFormClass = 'sending-error';

/**
 * Sends form data to the FormSpark using Fetch API
 * @async
 * @returns {Promise<Response>} The fetch response object
 */
const formSparkFetch = async (body) => {
  return fetch('https://submit-form.com/ls5SJYPy2', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });
};

/**
 * Creates and appends a success message block to the form
 * @param {HTMLElement} form - The form element to append the message to
 */
const createFormBlock = (form, message, classes) => {
  const block = document.createElement('div');
  block.className = classes;
  block.textContent = message;

  form.appendChild(block);
};

/**
 * Removes the success message block and clears 'success' class from form
 * @param {HTMLElement|null} form - The form element or null
 */
const removeFormBlock = (form, formClass, classes) => {
  if (!form) return;
  form.classList.remove(formClass);
  const block = form.querySelector(`.${classes}`);

  if (block) {
    block.remove();
  }
};

/**
 * Handles the form submit event for feedback.
 * @param {Event} evt - The form submit event.
 */
const feedbackFormSubmit = async (evt) => {
  evt.preventDefault();
  const form = evt.target;
  if (form) {
    try {
      removeFormBlock(form, catchFormClass, catchBlockClass);
      form.classList.add(loadingClass);
      const isValid = validate(form);
      if (isValid) {
        const formData = new FormData(form);
        const formValues = Object.fromEntries(formData.entries());
        const res = await formSparkFetch(formValues);
        if (res.ok) {
          form.classList.add(formSuccessClass);
          createFormBlock(form, successMessage, successBlockClass);

          setTimeout(() => {
            removeFormBlock(form, formSuccessClass, successBlockClass);
          }, 3000);
        }
      }
    } catch {
      createFormBlock(form, catchMessage, catchBlockClass);
    } finally {
      form.classList.remove(loadingClass);
    }
  }
};

/**
 * Initializes form event listeners
 * @function formsInit
 * @returns {void}
 */
const formsInit = () => {
  const feedbackForm = document.querySelector('#feedback-form');
  feedbackForm.addEventListener('submit', feedbackFormSubmit);
};

export default formsInit;
