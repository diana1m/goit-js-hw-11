import axios from "axios";
import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const form = document.querySelector(".search-form");
const gallery = document.querySelector(".gallery");
const lightbox = new SimpleLightbox('.gallery a');
const guard = document.querySelector(".js-guard");

let page = 1;
let per_page = 50;
let inputValue ="";

const options = {
    root: null,
    rootMargin: '300px',
    threshold: 0
}
let observer = new IntersectionObserver(onLoad, options);

form.addEventListener("submit", onSubmit);

function onLoad(entries, observer) {
    entries.forEach(entry => {
        // console.log(entry);
        if (entry.isIntersecting) {
            page += 1
            getImages(inputValue)
                .then(data => {
                    createMarkup(data.hits);
                    console.log(data);
                    console.log (page);
                    if (page * per_page >= data.totalHits) {
                        observer.unobserve(guard)
                    }
                })
                .catch(err => console.log(err))
        }
    })
}

function onSubmit(evn){
    evn.preventDefault();
    inputValue = evn.target[0].value;
    gallery.innerHTML = "";
    page = 1;
    
    getImages(inputValue)
    .then(data => {
        if(data.total === 0){
            throw new Error("Sorry, there are no images matching your search query. Please try again.");
        }
        console.log(data);
        
        createMarkup(data.hits);

        observer.observe(guard);
        lightbox.refresh();
    })
    .catch(err =>Notiflix.Notify.failure(err.message));
}


async function getImages(inputValue){
    const BASE_URL = "https://pixabay.com/api/";
    const KEY = "32976687-1605871f29f724bfaa9acfcd4";
    const response = await axios.get(`${BASE_URL}?key=${KEY}&q=${inputValue}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${per_page}`);
    return response.data;
}


function createMarkup(arr){
    const markup = arr.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads})=>
    `
        <a class="gallery-item link" href="${largeImageURL}">
            <div class="photo-card">
                <img src="${webformatURL}" alt="${tags}" loading="lazy" width="160px"  height = "106px" style = "object-fit: cover"/>
                <div class="info">
                    <p class="info-item">
                        <b>${likes} Likes</b>
                    </p>
                    <p class="info-item">
                        <b>${views} Views</b>
                    </p>
                    <p class="info-item">
                        <b>${comments} Comments</b>
                    </p>
                    <p class="info-item">
                        <b>${downloads} Downloads</b>
                    </p>
                </div>
            </div>
        </a>
    `).join('');

    gallery.insertAdjacentHTML('beforeend', markup);
}

