var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre');
var BookInstance = require('../models/bookinstance');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var async = require('async');

exports.index = function(req, res) {  
    async.parallel({
        book_count: function(callback) {
            Book.countDocuments(callback);
        },
        book_instance_count: function(callback) {
            BookInstance.countDocuments(callback);
        },
        book_instance_available_count: function(callback) {
            BookInstance.countDocuments(callback, {status:'Available'});
        },
        author_count: function(callback) {
            Author.countDocuments(callback);
        },
        genre_count: function(callback) {
            Genre.countDocuments(callback);
        },
    }, function(err, results) {
        res.render('index', { title: 'Local Library Home', error: err, data: results });
    });
};

// Display list of all books.
exports.book_list = function(req, res, next) {
    Book.find({}, 'title author')
    .populate('author')
    .exec(function(err, list){
        if (err) {next(err);}
        res.render('book_list', {title:'Book List', book_list: list});
    });
};

// Display detail page for a specific book.
exports.book_detail = function(req, res, next) {
    // res.send('NOT IMPLEMENTED: Book detail: ' + req.params.id);
    async.parallel({
        book: function(callback){
            Book.findById(req.params.id).populate('author').populate('genre').exec(callback);
        },
        book_list: function(callback){
            BookInstance.find({ 'book': req.params.id}).exec(callback);
        },
    }, function(error, results){
        if (error){ return next(error); }
        if (results.book_list==null){
            var err = new Error('book not found');
            err.status = 404;
            return next(err);
        }
        res.render('book_detail', {title: 'Book Detail', book: results.book, book_list: results.book_list} );
    });
};

// Display book create form on GET.
exports.book_create_get = function(req, res) {
    async.parallel({
        authors:function(callback){
            Author.find(callback);
        },
        genres:function(callback){
            Genre.find(callback);
        }
    }, function(err, results){
        if(err){return next(err);}
        res.render('book_form',{title:'Create Book', authors:results.authors, genres:results.genres});
    });
};

// Handle book create on POST.
exports.book_create_post = [
    (req, res, next) => {
        if(!req.body.genre instanceof Array){
            if(typeof req.body.genre==='undefined'){
                req.body.genre = [];
            } else {
                req.body.genre = new Array(req.body.genre);
            }
        }
        next();
    },

    // Validate fields.
    body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
    body('author', 'Author must not be empty.').isLength({ min: 1 }).trim(),
    body('summary', 'Summary must not be empty.').isLength({ min: 1 }).trim(),
    body('isbn', 'ISBN must not be empty').isLength({ min: 1 }).trim(),
  
    // Sanitize fields (using wildcard).
    sanitizeBody('*').trim().escape(),

    (req, res, next)=>{
        const errors = validationResult(req);
        if(errors.isEmpty()){
            var book = new Book(
                { title: req.body.title,
                  author: req.body.author,
                  summary: req.body.summary,
                  isbn: req.body.isbn,
                  genre: req.body.genre
                 });

            book.save(function (err) {
                if (err) { return next(err); }
                    //successful - redirect to new book record.
                    res.redirect(book.url);
                });
        } else {
            async.parallel({
                authors: function(callback){
                    Author.find(callback);
                },
                genres:function(callback){
                    Genre.find(callback);
                }
            }, function(err, results){
                if(err){return next(err);}

                for (let i = 0; i < results.genres.length; i++) {
                    const genre = array[i];
                    if(book.genre.indexOf(results.genres[i]._id) > -1){
                        genre.checked = 'true';
                    }
                }

                res.render('book_form', {title:'Book Create', authors:results.authors, genres:results.genres, errors:errors.array(), book:book});
            });
        }
    },
];

// Display book delete form on GET.
exports.book_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST.
exports.book_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display book update form on GET.
exports.book_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle book update on POST.
exports.book_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update POST');
};
