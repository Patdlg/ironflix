const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');
const fetch = require('node-fetch');
const passportFacebook = require('../helpers/facebook');
const Comment = require('../models/Comment')

//midelwers
function isAuth(req, res, next) {
    if (req.isAuthenticated()) return res.redirect('/home');
    return next();
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    return res.redirect('/login')
}

//rutas signup
router.get('/signup', (req, res) => {
    console.log('entramos a singnup')
    res.render('auth/signup')
})

router.post('/signup', (req, res, next) => {
    if (req.body.password !== req.body.password2) {
        req.body.err = "Tu password no coincide"
        res.rendirect('auth/signup', req.body)
    }
    User.register(req.body, req.body.password)
        //console.log("se agrego a la bd")
        .then(user => {
            console.log('entraste')
            res.redirect('/login')
        })
        .catch(e => {
            console.log("EEEEERRRROOORR")
            req.body.err = errDict[e.name];
            res.render('auth/signup', req.body)
        });
});

//login faceboock
router.get('/facebook', passportFacebook.authenticate('facebook'));

router.get('/facebook/callback',
    passportFacebook.authenticate('facebook', { failureRedirect: '/' }),
    function (req, res) {
        res.redirect('/login');
    });

//rutas login
router.get('/login', isAuth, (req, res) => {
    res.render('auth/login', { next: req.query.next })
})

router.post('/login', passport.authenticate('local'), (req, res, next) => {
    if (req.body.next) res.redirect(req.body.next);
    req.app.locals.loggedUser = req.user;
    res.redirect('/home')
})

//logout
router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/login')
});

//rutas perfil

router.get('/profile', isLoggedIn, (req, res, next) => {
    res.render('auth/profile')
})


//rutas home

router.get('/home', (req, res, next) => {
    fetch('https://api.themoviedb.org/3/genre/28/movies?api_key=82b5663c68f2ad62437a48269129ca36&language=es&include_adult=false&sort_by=created_at.asc')
        .then(results => results.json())
        .then(movies => {
            res.render('auth/home', movies);
        });
});

router.post('/home', (req, res, next) => {
    fetch("https://api.themoviedb.org/3/search/multi?api_key=064288a99145fce7b80f998a06a7f7d1&query=" + req.body.buscado)
        .then(results => results.json())
        .then(movies => {
            console.log(movies)
            res.render('auth/home', movies);
        });
})

//rutas details

router.get('/details/:id', (req, res) => {
    const id = req.params;
    fetch(`https://api.themoviedb.org/3/movie/${id.id}?api_key=82b5663c68f2ad62437a48269129ca36`)
        .then(result => result.json())
        .then(movie => {
            console.log(movie);
            res.render('auth/detail', movie);
        })
});
router.post('/details/:id', (req, res, next) => {
    const peli = req.params.id
    Comment.create(req.body, peli)
    res.redirect('/comments')
})

router.put('/edit/:id', (req, res) => {
    Comment.findOne({
        _id: req.params.id
    })
        .then(comment => {
            // new values
            comment.title = req.body.title;
            comment.details = req.body.details;

            comment.save()
                .then(comment => {
                    req.flash('success_msg', 'updated');
                    res.redirect('/comments');
                })
        });
});

module.exports = router;
