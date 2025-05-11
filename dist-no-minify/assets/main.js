/* empty css                  */
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function throttle(func, delay = 100) {
  let lastCall = 0;
  let timeoutId;
  return function(...args) {
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
const ruleFunctions = {
  required: (val) => !!val,
  email: (val) => {
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return regex.test(val);
  }
};
const ruleMessages = {
  required: "Field is required",
  email: "Invalid E-mail"
};
const createInputError = (message, wrapper) => {
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-div";
  errorDiv.textContent = message;
  wrapper.appendChild(errorDiv);
};
const deleteInputError = (el) => {
  if (!el) return;
  el.remove();
};
const clearValidationInput = (input) => {
  const wrapper = input.closest(".validate-wrapper");
  const errorDiv = wrapper.querySelector(".error-div");
  if (wrapper && errorDiv) {
    deleteInputError(errorDiv);
    input.classList.remove("invalid");
  }
};
const validate = (form) => {
  const validationInputs = form.querySelectorAll("input[validation-rules]");
  const invalidInputs = [];
  [...validationInputs].forEach((input) => {
    clearValidationInput(input);
    const value = input.type === "checkbox" ? input.checked : input.value;
    const rules = input.getAttribute("validation-rules").split("|");
    let foreachBreak = false;
    rules.forEach((rule) => {
      if (foreachBreak) return;
      const ruleFunction = ruleFunctions[rule];
      if (ruleFunction && !ruleFunction(value)) {
        invalidInputs.push({
          el: input,
          message: ruleMessages[rule]
        });
        foreachBreak = true;
      }
    });
  });
  invalidInputs.forEach(({ el: input, message }) => {
    const wrapper = input.closest(".validate-wrapper");
    if (wrapper) {
      wrapper.classList.add("not-valid");
      createInputError(message, wrapper);
      input.classList.add("invalid");
    }
  });
  return !invalidInputs.length;
};
const validateInit = () => {
  const formsWithValidate = document.querySelectorAll(".validate-form");
  [...formsWithValidate].forEach((form) => {
    const inputs = form.querySelectorAll("input[validation-rules]");
    [...inputs].forEach((input) => {
      const wrapper = input.closest(".validate-wrapper");
      input.addEventListener("input", () => {
        const errorDiv = wrapper.querySelector(".error-div");
        deleteInputError(errorDiv);
        input.classList.remove("invalid");
      });
    });
  });
};
const getOverlay = () => {
  return document.querySelector(".overlay");
};
const toggleOverlay = () => {
  const overlay = getOverlay();
  if (!overlay) return;
  overlay.classList.toggle("active");
};
const toggleBodyScroll = () => {
  document.body.classList.toggle("disable-scroll");
};
const header = document.querySelector("#header");
const headerScrollInit = () => {
  if (!header) {
    console.error("header does not exist");
    return;
  }
  window.addEventListener(
    "scroll",
    throttle(() => {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
      const scrolledClass = "header-scrolled";
      if (currentScroll > 0) {
        header.classList.add(scrolledClass);
      } else {
        header.classList.remove(scrolledClass);
      }
    })
  );
};
const headerMobileInit = () => {
  const headerOpenBtn = header.querySelector(".header-controls__btn");
  const headerCloseBtn = header.querySelector(".header-close__btn");
  const headerNav = header.querySelector(".header-nav");
  if (headerOpenBtn && headerNav) {
    headerOpenBtn.addEventListener("click", () => {
      headerNav.classList.add("open");
      toggleOverlay();
      toggleBodyScroll();
    });
  }
  if (headerCloseBtn && headerNav) {
    headerCloseBtn.addEventListener("click", () => {
      headerNav.classList.remove("open");
      toggleOverlay();
      toggleBodyScroll();
    });
  }
};
const headerFunctionsInit = () => {
  headerScrollInit();
  headerMobileInit();
};
const successMessage = "The form was sent successfully";
const successBlockClass = "success-block";
const formSuccessClass = "success";
const loadingClass = "loading";
const catchMessage = "Something went wrong, please try again";
const catchBlockClass = "error-block";
const catchFormClass = "sending-error";
const formSparkFetch = async (body) => {
  return fetch("https://submit-form.com/ls5SJYPy2", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(body)
  });
};
const createFormBlock = (form, message, classes) => {
  const block = document.createElement("div");
  block.className = classes;
  block.textContent = message;
  form.appendChild(block);
};
const removeFormBlock = (form, formClass, classes) => {
  if (!form) return;
  form.classList.remove(formClass);
  const block = form.querySelector(`.${classes}`);
  if (block) {
    block.remove();
  }
};
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
          }, 3e3);
        }
      }
    } catch {
      createFormBlock(form, catchMessage, catchBlockClass);
    } finally {
      form.classList.remove(loadingClass);
    }
  }
};
const formsInit = () => {
  const feedbackForm = document.querySelector("#feedback-form");
  feedbackForm.addEventListener("submit", feedbackFormSubmit);
};
window.addEventListener("DOMContentLoaded", () => {
  headerFunctionsInit();
  validateInit();
  formsInit();
});
