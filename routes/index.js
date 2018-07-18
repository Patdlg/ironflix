const express = require('express');
const router = express.Router();
const fetch = require('node-fetch')
/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/video', (req, res, next) => {
  res.render('auth/home');
});
router.post('/layout', (req, res, next) => {
  fetch("https://api.themoviedb.org/3/search/multi?api_key=064288a99145fce7b80f998a06a7f7d1&query=" + req.body.buscado)
    .then(results => results.json())
    .then(movies => {
      console.log(movies)
      res.render('auth/home', movies);
    })
})
module.exports = router;
