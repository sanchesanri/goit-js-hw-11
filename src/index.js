import axios from 'axios';
import { notifyFailure, notifySuccess, notifyInfo } from './helpers.js/notify';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const KEY_API = '33320710-0e89af02cb8a4d27c83fdc5a5';
const BASE_URL = 'https://pixabay.com/api/';
const quantityItemOnPAge = 40;

const galleryRef = document.querySelector('.gallery');
const formSearchRef = document.querySelector('.search-form');
const btnLoadMore = document.querySelector('.load-more');

formSearchRef.addEventListener('submit', onFormBtnSubmit);
btnLoadMore.addEventListener('click', onBtnLoadMOreClick);

axios.defaults.baseURL = BASE_URL;

const configAxios = {
  params: {
    key: KEY_API,
    lang: 'en',
    safesearch: true,
    per_page: quantityItemOnPAge,
    image_type: 'photo',
    orientation: 'horizontal',
    page: null,
    q: '',
  },
};


const options = {
  captions: true,
  captionSelector: 'img',
  captionsData: 'alt',
  captionPosition: 'top',
  captionDelay: 250,
  doubleTapZoom: 1,
  spinner:	true,
}

let lightbox = new SimpleLightbox('.gallery a', options);
lightbox.on('show.simplelightbox')


function onFormBtnSubmit(e) {
  e.preventDefault();
  const valueInput = e.target.elements.searchQuery.value.trim();
  if (!valueInput) {
    return
  }
  configAxios.params.page = 1;
  configAxios.params.q = valueInput;

  responseAPIWithAxios();

  formSearchRef.reset();
}

async function resolveAPI() {
  return await axios.get('', configAxios);
}

function responseAPIWithAxios() {
  resolveAPI()
    .then(res => {
      const arr = res.data.hits;

      if (!arr.length) {
        notifyFailure();
        addClassIsHidden();
        galleryRef.innerHTML = '';
        return;
      }

      removeClassHidden();
      notifySuccess(quantityItemOnPAge);
      galleryRef.innerHTML = markupResolve(arr);
    })
    .catch(error => {
      console.error(error);
    });
}

function moreResponseAPIWithAxios() {
  resolveAPI()
    .then(res => {
      removeClassHidden();

      const arr = res.data.hits;
      const sumQuery = configAxios.params.page * configAxios.params.per_page;

      
      galleryRef.insertAdjacentHTML('beforeend', markupResolve(arr));
      lightbox.refresh();


      console.log(sumQuery);
      if (sumQuery >= res.data.totalHits) {
        addClassIsHidden();
        notifyInfo();
        return;
      }

      notifySuccess(sumQuery);
    })
    .catch(error => {
      addClassIsHidden();
      console.error(error);
    });
}

function onBtnLoadMOreClick(e) {
  addClassIsHidden();
  configAxios.params.page += 1;
  moreResponseAPIWithAxios();
}

function markupResolve(arr) {
  return arr.map(createStringForMarkup).join('\n');
}

function createStringForMarkup(obj) {
  const {
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads,
  } = obj;

  return `<div class="photo-card">
            <a href="${largeImageURL}">
              <img src="${webformatURL}" alt="${tags}" loading="lazy" min-width=320/>
            </a>
            <div class="info">
              <p class="info-item">
                <b>Likes</b>${likes}
              </p>

              <p class="info-item">
                <b>Views</b>${views}
              </p>

              <p class="info-item">
                <b>Comments</b>${comments}
              </p>

              <p class="info-item">
                <b>Downloads</b>${downloads}
              </p>
          </div>
        </div>`;
}

function addClassIsHidden() {
  btnLoadMore.classList.add('is-hidden');
}

function removeClassHidden() {
  btnLoadMore.classList.remove('is-hidden');
}


