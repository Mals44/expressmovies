const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const jwt = require('jsonwebtoken');

const PORT = 3000;

let frenchMovies = [];

app.use('/public', express.static('public'));
//app.use(bodyParser.urlencoded({
//extended: false
//}));

app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/movies', (req, res) => {

    const title = 'Films français des trente derniéres années';
    frenchMovies = [{
            title: 'le fabuleux destin d\'Amélie Poulain',
            year: 2001
        },
        {
            title: 'Buffet froid',
            year: 1976
        },
        {
            title: 'Le diner de cons',
            year: 1998
        },
        {
            title: 'De rouille et d\'os',
            year: 2012
        }
    ];
    res.render('movies', {
        movies: frenchMovies,
        title: title
    });
});
var urlencodedParser = bodyParser.urlencoded({
    extended: false
});

//app.post('/movies', urlencodedParser, (req, res) => {
//console.log('titre: ', req.body.movietitle);
//console.log('année: ', req.body.movieyear);

// const newMovie = {
// title: req.body.movietitle,
// year: req.body.movieyear
//};
//frenchMovies = [...frenchMovies, newMovie];
// console.log(frenchMovies);

//res.sendStatus(201);
//});

app.post('/movies', upload.fields([]), (req, res) => {
    if (!req.body) {
        return res.sendStatus(500);
    } else {
        const formData = req.body;
        console.log('formData: ', formData);
        const newMovie = {
            title: req.body.movietitle,
            year: req.body.movieyear
        };
        frenchMovies = [...frenchMovies, newMovie];
        console.log(frenchMovies);
        res.sendStatus(201);
    }
});


app.get('/movies/add', (req, res) => {
    res.send(`Prochaiment un formulaire d\'ajout ici`);
    res.render('movies');
});

app.get('/movies/:id', (req, res) => {
    const id = req.params.id;
    const title = req.params.title;
    //res.send(`film numero ${id}`)
    res.render('movies-details', {
        movieid: id,
    });
});

app.get('/', (req, res) => {
    //res.send('BONJOURS LES AMIS!!!!');
    res.render('index')
});

app.get('/movie-search', (req, res) => {
    res.render('movie-search');
});

app.get('/login', (req, res) => {
    res.render('login', {
        title: 'Espace membres'
    });

});

const fakeUser = {
    email: 'toto@totomail.fr',
    password: '2019'
};
const secret = 'qsdjS12ozehdoIJ123DJOZJLDSCqsdeffdg123ER56SDFZedhWXojqshduzaohduihqsDAqsdq';
app.post('/login', urlencodedParser, (req, res) => {

    console.log('login post', req.body);
    if (!req.body) {
        res.sendStatus(500)
    } else {
        if (fakeUser.email === req.body.email && fakeUser.password === req.body.password) {
            const myToken = jwt.sign({
                    iss: 'http://expressmovies.fr',
                    user: 'Malang',
                    role: 'moderator'
                },
                secret);
            res.json(myToken);
        } else {
            res.sendStatus(401);
        }
    }
});


app.listen(PORT, () => {
    console.log(`listen on port ${PORT}`);
});