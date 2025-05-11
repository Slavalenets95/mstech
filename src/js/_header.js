import { throttle, toggleOverlay, toggleBodyScroll } from './_helpers';

const header = document.querySelector('#header');

/**
 * Initializes scroll behavior for header element
 * @function
 * @returns {void}
 * @throws {Error} Logs error to console if header element is not found
 */
const headerScrollInit = () => {
  if (!header) {
    console.error('header does not exist');
    return;
  }

  window.addEventListener(
    'scroll',
    throttle(() => {
      const currentScroll =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrolledClass = 'header-scrolled';

      if (currentScroll > 0) {
        header.classList.add(scrolledClass);
      } else {
        header.classList.remove(scrolledClass);
      }
    }),
  );
};

/**
 * Initializes the mobile header menu functionality.
 * @returns {void}
 */
const headerMobileInit = () => {
  const headerOpenBtn = header.querySelector('.header-controls__btn');
  const headerCloseBtn = header.querySelector('.header-close__btn');
  const headerNav = header.querySelector('.header-nav');

  if (headerOpenBtn && headerNav) {
    headerOpenBtn.addEventListener('click', () => {
      headerNav.classList.add('open');
      toggleOverlay();
      toggleBodyScroll();
    });
  }

  if (headerCloseBtn && headerNav) {
    headerCloseBtn.addEventListener('click', () => {
      headerNav.classList.remove('open');
      toggleOverlay();
      toggleBodyScroll();
    });
  }
};

/**
 * Main initialization function for all header-related functionality
 * @function
 * @returns {void}
 */
const headerFunctionsInit = () => {
  headerScrollInit();
  headerMobileInit();
};

export default headerFunctionsInit;
