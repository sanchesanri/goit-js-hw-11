import axios from 'axios';
import { notifyFailure, notifySuccess, notifyInfo } from './helpers.js/notify';

const KEY_API = '33320710-0e89af02cb8a4d27c83fdc5a5';
const BASE_URL = 'https://pixabay.com/api/';

const galleryRef = document.querySelector('.gallery');
const formSearchRef = document.querySelector('.search-form');
const btnLoadMore = document.querySelector('.load-more');

formSearchRef.addEventListener('submit', onFormBtnSubmit);
btnLoadMore.addEventListener('click', onBtnLoadMOreClick);

axios.defaults.baseURL = BASE_URL;

const quantityItemOnPAge = 40;

const configAxios = {
  params: {
    key: KEY_API,
    lang: 'en',
    safesearch: true,
    per_page: quantityItemOnPAge,
    image_type: 'photo',
    orientation: 'horizontal',
    page: 1,
    q: '',
  },
};

function onFormBtnSubmit(e) {
  e.preventDefault();
  const valueInput = e.target.elements.searchQuery.value.trim();

  configAxios.params.q = valueInput;
  responseAPIWithAxios();

  formSearchRef.reset();
}

async function resolveAPI() {
  const res = await axios.get('', configAxios);
  return res;
}

async function responseAPIWithAxios() {
  // const res = await axios.get('', configAxios);
  resolveAPI()
    .then(res => {
      const arr = res.data.hits;

      if (!arr.length) {
        notifyFailure();
        galleryRef.innerHTML = '';
        return;
      }

      btnLoadMore.classList.remove('is-hidden');
      notifySuccess();
      galleryRef.innerHTML = markupResolve(arr);
    })
    .catch(console.error);
}

async function moreResponseAPIWithAxios() {
  resolveAPI()
    .then(res => {
      btnLoadMore.classList.remove('is-hidden');

      const arr = res.data.hits;
      const sumQuery = configAxios.params.page * configAxios.params.per_page;
      console.log(sumQuery);
      console.log(res.data.totalHits);

      if (sumQuery >= res.data.totalHits) {
        btnLoadMore.classList.add('is-hidden');
        notifyInfo()
        return;
      }

      galleryRef.insertAdjacentHTML('beforeend', markupResolve(arr));
    })
    .catch(console.error);
}

function onBtnLoadMOreClick(e) {
  btnLoadMore.classList.add('is-hidden');
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
            <img src="${webformatURL}" alt="${tags}" loading="lazy" width=320
            />
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
