import { Notify } from 'notiflix';

Notify.init({
  width: '350px',
  position: 'center-left',
  distance: '10px',
  opacity: 1,
  timeout: 2000,

  failure: {
    background: '#ff0000',
    textColor: '#fff',
    childClassName: 'notiflix-notify-failure',
    notiflixIconColor: 'rgba(0,0,0,0.2)',
    fontAwesomeClassName: 'fas fa-times-circle',
    fontAwesomeIconColor: 'rgba(0,0,0,0.2)',
    backOverlayColor: 'rgba(255,85,73,0.2)',
  },

  success: {
    background: '#784edb',
    svgColor: '#32c682',
    titleColor: '#1e1e1e',
    messageColor: '#242424',
    buttonBackground: '#32c682',
    buttonColor: '#fff',
    backOverlayColor: 'rgba(50,198,130,0.2)',
  },
});

function notifyFailure() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function notifySuccess() {
  Notify.success('Access ');
}

function notifyInfo () {
  Notify.info("We're sorry, but you've reached the end of search results.")
}

export {notifyFailure, notifySuccess,notifyInfo}
