var BookInstance = require('../models/bookinstance');
var Book = require('../models/book');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all BookInstances.
exports.bookinstance_list = function(req, res, next) {
    // res.send('NOT IMPLEMENTED: BookInstance list');
    BookInstance.find()
    .populate('book')
    .exec(function(error, book_list){
        if (error){return next(error);}
        res.render('bookInstance_list', {title:'Book copy List', book_list: book_list});
    });
};

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = function(req, res, next) {
    // res.send('NOT IMPLEMENTED: BookInstance detail: ' + req.params.id);
    BookInstance
    .findById(req.params.id)
    .populate('book')
    .exec(function(error, book){
        if(error){ return next(error);}
        if(book == null){
            var err = new Error('no book copy');
            err.status = 404;
            return err;
        }
        res.render('bookinstance_detail', { title:'Book Detail', bookins:book });
    });
};

// Display BookInstance create form on GET.
exports.bookinstance_create_get = function(req, res, next) {
    Book.find({}, 'title').exec(function(error, books){
        if(error){return next(error);}
        res.render('bookinstance_form', {title:'Create Book Copies', book_list:books});
    });
};

// Handle BookInstance create on POST.
exports.bookinstance_create_post = [
    // Validate fields.
    body('book', 'Book must be specified').isLength({ min: 1 }).trim(),
    body('imprint', 'Imprint must be specified').isLength({ min: 1 }).trim(),
    body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),
    
    // Sanitize fields.
    sanitizeBody('book').trim().escape(),
    sanitizeBody('imprint').trim().escape(),
    sanitizeBody('status').trim().escape(),
    sanitizeBody('due_back').toDate(),

    (req, res, next)=>{
        const errors = validationResult(req);
        var bookinstance = new BookInstance(
            { book: req.body.book,
              imprint: req.body.imprint,
              status: req.body.status,
              due_back: req.body.due_back
             });
        if(errors.isEmpty()){
            bookinstance.save(function (err) {
                if (err) { return next(err); }
                    // Successful - redirect to new record.
                    res.redirect(bookinstance.url);
                });
        } else {
            Book.find({}, 'title').exec(function(error, books){
                if(error){return next(error);}
                res.render('bookinstance_form', {
                    title:'Create book copies', 
                    book_list:books,
                    selected_book:bookinstance.book._id,
                    errors:errors.array(),
                    bookinstance:bookinstance
                });
            });
        }
    }
];

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance delete GET');
};

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance delete POST');
};

// Display BookInstance update form on GET.
exports.bookinstance_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance update GET');
};

// Handle bookinstance update on POST.
exports.bookinstance_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance update POST');
};
