var Author = require('../models/author');
var Book = require('../models/book')
var async = require('async')

// Display list of all Authors.
exports.author_list = function(req, res, next) {
    // res.send('NOT IMPLEMENTED: Author list');
    Author
    .find()
    .sort([['family_name', 'ascending']])
    .exec(function(error, author_list){
        if (error) { return next(error); }
        res.render('author_list', { title:'Author List', author_list:author_list });
    });
};

// Display detail page for a specific Author.
exports.author_detail = function(req, res, next) {
    async.parallel({
        author: function(callback){
            Author.findById(req.params.id).exec(callback);
        },
        books: function(callback){
            Book.find({'author': req.params.id}, 'title summary').sort([['title', 'ascending']]).exec(callback);
        }
    }, function(error, results){
        if(error) {return next(error);}
        if(results.author==null){
            var err = new Error('no specified author');
            err.status = 404;
            return next(err);
        }
        res.render('author_detail', { title:'Author Detail', author: results.author, books: results.books});
    });
};

// Display Author create form on GET.
exports.author_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author create GET');
};

// Handle Author create on POST.
exports.author_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author create POST');
};

// Display Author delete form on GET.
exports.author_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete GET');
};

// Handle Author delete on POST.
exports.author_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete POST');
};

// Display Author update form on GET.
exports.author_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Author update on POST.
exports.author_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update POST');
};