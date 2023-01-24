import axios from "axios";
export async function getImages(inputValue, page, per_page){
    const BASE_URL = "https://pixabay.com/api/";
    const KEY = "32976687-1605871f29f724bfaa9acfcd4";
    const response = await axios.get(`${BASE_URL}?key=${KEY}&q=${inputValue}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${per_page}`);
    return response.data;
}