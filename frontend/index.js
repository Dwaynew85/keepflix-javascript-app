let info;
let movies;
let user;
let users;
let test;
document.addEventListener('DOMContentLoaded',function() {
    fetch('http://localhost:3000/users/')
    .then(response => response.json())
    .then(json => users = json.data); 
    fetch('http://localhost:3000/')
    .then(response => response.json())
    .then(json => setInfo(json));
})
// set variables for fetch data
let setInfo = (json) => {
    info = json,
    movies = info[0].data //.map(movie => movie.attributes)
    user = new User(info[1].data.attributes)
    addUser(user); // adds user on page start ;)
    movies.forEach(movie => addMovie(movie));
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
    userName.innerHTML = `Welcome, ${user.name}!`;
    const  userEmail = document.createElement('p');
    userEmail.innerHTML = user.email;
    userDiv.append(userImg, userName, userEmail);
    return document.getElementById('top').appendChild(userDiv);
}
//function that adds movie by object
let addLi = (element) => {
    const li = document.createElement('li')
    li.innerHTML = element;
}

function addMovie(movie) {
    const movieDiv = document.createElement('div')
    const titleDiv = document.createElement('div') // DIV 1
    const commentFormDiv = document.createElement('div')
    movieDiv.className = 'movie-post';
    movieDiv.id = "movie_" + `${movie.id}`
    titleDiv.className = 'title';
    commentFormDiv.className = 'comment-form';
    const movieTitle = document.createElement('h1');
    movieTitle.innerHTML = movie.attributes.title;
    const moviePoster = document.createElement('h4');
    const movieImage = document.createElement('img');
    movieImage.src = movie.attributes.image_url;
    const movieA = document.createElement('a');
    movieA.appendChild(movieImage);
    movieA.href = `/movies/${movie.id}`;
    moviePoster.appendChild(movieA);
    titleDiv.append(movieTitle, moviePoster);

    const detailsDiv = document.createElement('div'); // DIV 2
    detailsDiv.className = 'details';
    const ul = document.createElement('ul');
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

    // create div with movie comment info
    const commentDiv = document.createElement('div')
    commentDiv.className = 'comments'
    
    movie.attributes.comments.forEach(comment => createCommentDiv(comment, commentDiv));
    commentFormDiv.appendChild(commentForm(movie))
    movieDiv.prepend(titleDiv, detailsDiv, commentDiv, commentFormDiv)
    return document.getElementById('feed').appendChild(movieDiv);
}
function commentForm(movie) {
    let form = document.createElement("form");
    form.setAttribute("method", "POST");
    form.setAttribute("action", `http://localhost:3000/movies/${movie.id}/comments`);

    let hide = document.createElement("input");
    hide.setAttribute("type", "hidden");

    let s = document.createElement("input");
    s.setAttribute("placeholder", "Enter Comment");
    s.setAttribute("type", "text");
    s.setAttribute("name", "comment[content]");
    s.setAttribute("id", "comment_content");

    let submit = document.createElement("input");
    submit.setAttribute("type", "submit");
    submit.setAttribute("name", "commit")
    submit.setAttribute("value", "Create Comment")
    submit.setAttribute("style", "display: none")
    submit.setAttribute("data-disabled-with", "Create Comment")
    function newComment(input) {
        fetch(input.form.action, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Accept": "application/json"
            },
            body: JSON.stringify({"content": input.value})
        })
        .then(response => response.json())
        .then(data => test = data)
        .catch(function(error) {
            alert(error.message);
        }); 
        input.value = '';
    }
    form.addEventListener("submit", function(e) {
        e.preventDefault();
        return newComment(s); // s.value is the submission content
    });
    form.append(hide, s, submit)
    return form
}

function createCommentDiv(comment, parentDiv) {
    let commenter = users.find(x => parseInt(x.id) === comment.user_id).attributes
    let comDiv = document.createElement('div')
    let profPic = document.createElement('img')
    comDiv.className = 'comment'
    profPic.className = 'prof_pic'
    profPic.src = commenter.pic_url
    let h6 = document.createElement('h6');
    h6.innerHTML = `${commenter.name}`;
    let contentP = document.createElement('p');
    contentP.innerHTML = comment.content;
    let timeH6 = document.createElement('h6');
    timeH6.innerHTML = new Date(comment.updated_at) // needs to be simplified....eventually
    // let buttonH6 = document.createElement('h6')
    // add edit and delete buttons for buttonH6
    comDiv.append(profPic, h6, contentP, timeH6)
    parentDiv.appendChild(comDiv)
}

let commentForms = document.querySelectorAll('#comment_content')
commentForms.forEach(form => form.addEventListener('submit', function(e) {
    e.preventDefault();
    console.log(e);
}));