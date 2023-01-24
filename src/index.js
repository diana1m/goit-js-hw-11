
import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { getImages } from "./js/getImages";

const form = document.querySelector(".search-form");
const gallery = document.querySelector(".gallery");
const lightbox = new SimpleLightbox('.gallery a');
const guard = document.querySelector(".js-guard");

// gallery.insertAdjacentHTML("beforebegin", `<svg width="16px" height="16px">
// <use href="./images/symbol-defs.svg#icon-favorite"></use>
// </svg>`)

// form.insertAdjacentHTML("afterbegin", `<img src="./images/PNG/comment.png" alt="comment">`)

let page = 1;
let per_page = 40;
let inputValue ="";

const options = {
    root: null,
    rootMargin: '400px',
    threshold: 0
}
let observer = new IntersectionObserver(onLoad, options);

form.addEventListener("submit", onSubmit);



function onSubmit(evn){
    evn.preventDefault();
    inputValue = evn.target[0].value;

    gallery.innerHTML = "";
    page = 1;

    if(inputValue.trim() === ""){
        Notiflix.Notify.warning("Please enter a word");
        return;
    }
    
    
    getImages(inputValue, page, per_page)
    .then(data => {
        if(data.total === 0){
            throw new Error("Sorry, there are no images matching your search query. Please try again.");
        }
        console.log(data);

        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`)
        
        createMarkup(data.hits);

        observer.observe(guard);
        lightbox.refresh();
    })
    .catch(err =>Notiflix.Notify.failure(err.message));
}


function onLoad(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            page += 1
            getImages(inputValue, page, per_page)
                .then(data => {
                    createMarkup(data.hits);
                    // console.log(data);
                    // console.log (page);
                    if (page * per_page >= data.totalHits) {
                        observer.unobserve(guard);
                        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
                    }
                })
                .catch(err => console.log(err))
        }
    })
}

function createMarkup(arr){
    const markup = arr.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads})=>
    `
        <a class="gallery-item link" href="${largeImageURL}">
            <div class="photo-card">
                <img class="image" src="${webformatURL}" alt="${tags}" loading="lazy" width="160px"  height = "106px" />
                <div class="info">
                    <p class="info-item">
                        <b>${likes} 
                        </b>
                        <span class="material-symbols-outlined">favorite</span>
                    </p>
                    <p class="info-item">
                        <b>${views}</b>
                        <span class="material-symbols-outlined">visibility</span>
                    </p>
                    <p class="info-item">
                        <b>${comments} </b>
                        <span class="material-symbols-outlined">comment</span>
                    </p>
                    <p class="info-item">
                        <b>${downloads} </b>
                        <span class="material-symbols-outlined">download</span>
                    </p>
                </div>
            </div>
        </a>
    `).join('');

    gallery.insertAdjacentHTML('beforeend', markup);
}

