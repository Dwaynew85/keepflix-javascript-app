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
let setInfo = (json) => {
    info = json,
    movies = info[0].data 
    user = new User(info[1].data.attributes)
    addUser(user); 
    movies.forEach(movie => addMovie(movie));
}
class User {
    constructor(object) {
        this.id = object.id;
        this.name = object.name;
        this.email = object.email;
        this.pic = object.pic_url;
    }
}
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
let addLi = (element) => {
    const li = document.createElement('li')
    li.innerHTML = element;
}

function addMovie(movie) {
    const movieDiv = document.createElement('div')
    const titleDiv = document.createElement('div')
    const commentFormDiv = document.createElement('div')
    movieDiv.className = 'movie-post';
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

    const detailsDiv = document.createElement('div');
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

    const commentDiv = document.createElement('div')
    commentDiv.className = 'comments'
    commentDiv.id = "movie_" + `${movie.id}`
    
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
        .then(data => addCommentData(data))
        .catch(function(error) {
            alert(error.message);
        }); 
        input.value = '';
    }
    form.addEventListener("submit", function(e) {
        e.preventDefault();
        return newComment(s); 
    });
    form.append(hide, s, submit)
    return form
}

function createCommentDiv(comment, parentDiv) {
    let commenter = users.find(x => parseInt(x.id) === comment.user_id).attributes
    let comDiv = document.createElement('div')
    let profPic = document.createElement('img')
    comDiv.className = 'comment'
    comDiv.id = `comment_${comment.id}`
    profPic.className = 'prof_pic'
    profPic.src = commenter.pic_url
    let h6 = document.createElement('h6');
    h6.innerHTML = `${commenter.name}`;
    let contentP = document.createElement('p');
    contentP.innerHTML = comment.content;
    let timeH6 = document.createElement('h6');
    timeH6.innerHTML = new Date(comment.updated_at).toLocaleString()
    comDiv.append(profPic, h6, contentP, timeH6)
    if (comment.user_id === user.id) {
        comDiv.append(addEdit(comment), addDelete(comment))
    }
    parentDiv.appendChild(comDiv)
}

function addCommentData(info){
    let comment = info.data.attributes;
    let parentDiv = document.getElementById("movie_" + info.data.attributes.movie_id);
    createCommentDiv(comment, parentDiv);
}

let commentForms = document.querySelectorAll('#comment_content')
commentForms.forEach(form => form.addEventListener('submit', function(e) {
    e.preventDefault();
    console.log(e);
}));

function addDelete(comment) {
    let delForm = document.createElement('form');
    let hidInp = document.createElement('input')
    let subInp = document.createElement('input')
    Object.assign(delForm, {
        className: 'button_to',
        action: `http://localhost:3000/movies/${comment.movie_id}/comments/${comment.id}`,
        method: 'DELETE',
        onclick: function (e) {
            e.preventDefault();
            fetch(delForm.action, {
                method: "delete",
                headers: {
                    'Content-Type': 'application/json',
                    "Accept": "application/json"
                }
            })
            .catch(function(error) {
                alert(error.message);
            });
            document.getElementById(`comment_${comment.id}`).remove()
        }
    })
    Object.assign(hidInp, {
        type: 'hidden',
        name: '_method',
        value: 'delete'
    })
    Object.assign(subInp, {
        className: 'destroy',
        type: 'submit',
        value: "X"
    })
    delForm.append(hidInp, subInp)
    return delForm
}

function addEdit(comment) {
    let btn = document.createElement('button')
    btn.innerHTML = "Edit"
    Object.assign(btn, {
        className: 'edit',
        onclick: function (e) {
            btn.parentNode.append(editForm(comment));
            btn.remove();
        }
    })
    return btn
}

function editForm(comment) { 
    let form = document.createElement('form');
    let hidInp = document.createElement('input');
    let textInp = document.createElement('input');
    let subInp = document.createElement('input');
    Object.assign(form, {
        action: `http://localhost:3000/movies/${comment.movie_id}/comments/${comment.id}`,
        method: "PATCH"
    });
    Object.assign(hidInp, {
        type: 'hidden',
        name: '_method',
        value: 'patch'
    });
    Object.assign(textInp, {
        type: 'text',
        placeholder: `${comment.content}`,
        name: 'comment[content]',
        id: 'comment_content'
    });
    form.addEventListener('submit', function(e) {        
        e.preventDefault();
        fetch(form.action, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                "Accept": "application/json"
            },
            body: JSON.stringify({"content": textInp.value})
        })
        .then(response => response.json())
        .then(comment => editComment(form, comment)) 
        .catch(function(error) {
            alert(error.message);
        });
    });
    Object.assign(subInp, {
        type: 'submit',
        name: 'commit',
        value: 'Update Comment',
        className: 'button_to'
    });
    form.append(hidInp, textInp, subInp)    
    return form
}

function editComment(form, comment) {
    form.parentElement.childNodes[2].innerHTML = comment.data.attributes.content;
    form.reset();
    form.parentElement.append(addEdit(comment));
    form.remove();
}
