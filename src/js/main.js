import 'the-new-css-reset/css/reset.css';
import '../styles/style.css';
import headerFunctionsInit from './_header';
import formsInit from './_forms';
import { validateInit } from './_helpers';

window.addEventListener('DOMContentLoaded', () => {
  headerFunctionsInit();
  validateInit();
  formsInit();
});
