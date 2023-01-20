import axios from "axios";
import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const form = document.querySelector(".search-form");
const gallery = document.querySelector(".gallery");
// const list = document.createElement("ul");

// list.classList.add("list-images");
// gallery.append(list);

const lightbox = new SimpleLightbox('.gallery a');

form.addEventListener("submit", onSubmit);

function onSubmit(evn){
    evn.preventDefault();
    const inputValue = evn.target[0].value;

    // list.innerHTML = "";

    gallery.innerHTML = "";

    getImages(inputValue)
    .then(data => {
        if(data.total === 0){
            throw new Error("Sorry, there are no images matching your search query. Please try again.");
        }
        console.log(data)
        
        createMarkup(data.hits);
        lightbox.refresh();
    })
    .catch(err => Notiflix.Notify.failure(err.message));
}

async function getImages(input){
    const BASE_URL = "https://pixabay.com/api/";
    const KEY = "32976687-1605871f29f724bfaa9acfcd4";
    const response = await axios.get(`${BASE_URL}?key=${KEY}&q=${input}&image_type=photo&orientation=horizontal&safesearch=true`);
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