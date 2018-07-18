const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

require('../models/Comment');
const Comment = mongoose.model('comments');
// Load Idea Model
// const Comment = require('../models/Comment');

// Idea Index Page
router.get('/', (req, res) => {
  Comment.find({})
    .sort({ date: 'desc' })
    .then(comments => {
      res.render('comments/moviescomments', {
        comments: comments
      });
    });
});

// Add Idea Form
router.get('/detail', (req, res) => {
  res.render('comments/moviescomments');
});



// Edit Idea Form
router.get('/edit', (req, res) => {
  Comment.findOne({
    _id: req.params.id
  })
    .then(comment => {
      res.render('comments/moviescomments', {
        comment: comment
      });
    });
});


// Process Form
router.post('/', (req, res) => {
  let errors = [];

  if (!req.body.title) {
    errors.push({ text: 'Please add ' });
  }
  if (!req.body.text) {
    errors.push({ text: 'Please add some details' });
  }

  if (errors.length > 0) {
    res.render('/add', {
      errors: errors,
      title: req.body.title,
      text: req.body.text
    });
  } else {
    const newUser = {
      title: req.body.title,
      text: req.body.text
    }
    new Comment(newUser)
      .save()
      .then(comment => {
        req.flash('success_msg', 'Comment Added');
        res.redirect('/comments');
      })
  }
});

//Edit form
router.put('/', (req, res) => {
  Comment.findOne({
    _id: req.params.id
  })
    .then(comment => {
      // new values
      comment.title = req.body.title;
      comment.text = req.body.text;

      comment.save()
        .then(comment => {
          req.flash('success_msg', 'comment updated');
          res.redirect('/comments');
        })
    });
});

// Delete Idea
router.delete('/:id', (req, res) => {
  Comment.remove({ _id: req.params.id })
    .then(() => {
      req.flash('success_msg', 'comment removed');
      res.redirect('/comments');
    });
});

module.exports = router;