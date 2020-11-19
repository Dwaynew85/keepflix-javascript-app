fetch('http://localhost:3000/')
.then(response => response.json())
.then(json => console.log(json))
