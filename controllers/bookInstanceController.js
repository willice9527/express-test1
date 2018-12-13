var BookInstance = require('../models/bookinstance');

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
exports.bookinstance_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance create GET');
};

// Handle BookInstance create on POST.
exports.bookinstance_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance create POST');
};

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
