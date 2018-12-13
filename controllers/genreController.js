var Genre = require('../models/genre');
var Book = require('../models/book');
var async = require('async');
const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

// Display list of all Genre.
exports.genre_list = function(req, res, next) {
    Genre
    .find()
    .sort([['name', 'ascending']])
    .exec(function(error, genre_list){
        if (error) { return next(error); }
        res.render('genre_list', { title:'Genre list', genre_list: genre_list})
    });
};

// Display detail page for a specific Genre.
exports.genre_detail = function(req, res, next) {
    async.parallel({
        genre: function (callback){
            Genre.findById(req.params.id).exec(callback);
        },
        books: function (callback){
            Book.find({'genre': req.params.id}).exec(callback);
        }
    }, function(error, result){
        if (error){ return next(error); }
        if (result.genre==null){
            var err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }
        res.render('genre_detail', { title: 'Genre detail', genre : result.genre, books: result.books});
    });
};

// Display Genre create form on GET.
exports.genre_create_get = function(req, res, next) {
    res.render('genre_form', {title : 'Genre Create'});
};

// Handle Genre create on POST.
exports.genre_create_post = [
    // Validate that the name field is not empty.
    body('name', 'Genre name required').isLength({ min: 1 }).trim(),
    
    // Sanitize (trim and escape) the name field.
    sanitizeBody('name').trim().escape(),

    (req, res, next) => {
        const errors = validationResult(req);
        var genre = new Genre({ name:req.body.name });
        if (!errors.isEmpty) {
            res.render('genre_form', {title:'Genre Create', genre:genre, errors:errors.array()});
            return;
        } else {
            Genre
            .findOne({'name': req.params.name})
            .exec(function(error, found_genre){
                if(error){ return next(error); }
                if(found_genre){
                    res.redirect(found_genre.url);
                }else {
                    genre.save(function(err){
                        if(err){return next(err);}
                        res.redirect(genre.url);
                    });
                }
            });
        }
    }
];

// Display Genre delete form on GET.
exports.genre_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre delete GET');
};

// Handle Genre delete on POST.
exports.genre_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre delete POST');
};

// Display Genre update form on GET.
exports.genre_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST.
exports.genre_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update POST');
};
