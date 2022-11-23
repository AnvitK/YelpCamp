const { campgroundSchema, reviewSchema } = require('./validateSchema');
const Campground = require('./models/campground');
const Review = require('./models/review'); 

const ExpressError = require('./utils/ExpressError');

module.exports.isLoggedIn = (req, res, next) => {
    // console.log('REQUEST USER: ', req.user);
    if(!req.isAuthenticated()) {
        // console.log(req.path, req.originalUrl);
        req.session.returnBackTo = req.originalUrl;
        req.flash('error', 'You must be logged in first!!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(ele => ele.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have the permission to edit the campground!!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have the permission to delete the review!!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(ele => ele.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}