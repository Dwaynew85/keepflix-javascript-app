let info;
let movies;
let user;
fetch('http://localhost:3000/')
.then(response => response.json())
.then(json => setInfo(json))
// set variables for fetch data
let setInfo = (json) => {
    info = json,
    movies = info[0].data //.map(movie => movie.attributes)
    user = new User(info[1].data.attributes)
}
class User {
    constructor(object) {
        this.name = object.name;
        this.email = object.email;
        this.pic = object.pic_url;
    }
}
// function takes in user data and adds it to DOM
function addUser(user) {
    const userDiv = document.createElement('div');
    userDiv.className = 'user';
    const userImg = document.createElement('img');
    userImg.setAttribute('src', user.pic);
    const userName = document.createElement('h4');
    userName.innerHTML = user.name;
    const  userEmail = document.createElement('p');
    userEmail.innerHTML = user.email;
    userDiv.append(userImg, userName, userEmail);
    document.getElementById('wrapper').appendChild(userDiv);
}
//function that adds movie by object
let addLi = (element) => {
    const li = document.createElement('li')
    li.innerHTML = element;
}

function addMovie(movie) {
    // create div with class 'movie-post'
    const movieDiv = document.createElement('div')
    const titleDiv = document.createElement('div') // DIV 1
    movieDiv.className = 'movie-post';
    titleDiv.className = 'title'
    // h1 with anchor to movie title(or just regular title)
    const movieTitle = document.createElement('h1');
    movieTitle.innerHTML = movie.attributes.title;
    // h4 anchor with img for movie poster
    const moviePoster = document.createElement('h4');
    const movieImage = document.createElement('img');
    movieImage.src = movie.attributes.image_url;
    const movieA = document.createElement('a');
    movieA.appendChild(movieImage);
    movieA.href = `/movies/${movie.id}`;
    moviePoster.appendChild(movieA);
    titleDiv.append(movieTitle, moviePoster);
    console.log(titleDiv)

    // create dive with class 'movie-details
    const detailsDiv = document.createElement('div'); // DIV 2
    detailsDiv.className = 'details';
    const ul = document.createElement('ul');
    // create ul for movie details
    // create li to add movie detail to ul
    let movieLi = (info) => {
        let list = document.createElement('li')
        list.innerHTML = info;
        ul.appendChild(list);
    }
    movieLi(movie.attributes.rating)
    movieLi(movie.attributes.genres)
    movieLi(movie.attributes.release_date)
    movieLi(movie.attributes.runtime)
    movieLi(movie.attributes.stars)
    movieLi(movie.attributes.summary)
    movieLi(movie.attributes.trailer_link)    
    detailsDiv.appendChild(ul)
    console.log(detailsDiv)

    // create div with movie comment info
    const commentDiv = document.createElement('div')
    commentDiv.className = 'comments'
    // comments have class 'comment'
    // create form for comment

}


