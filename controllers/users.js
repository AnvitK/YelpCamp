const User = require('../models/user');

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username, password });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) { return next(err); }
            req.flash('success','Welcome to Yelp Camp!!!');
            res.redirect('/campgrounds');
        });
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/register');
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome Back!!');
    const redirectUrl = req.session.returnBackTo || '/campgrounds';
    delete req.session.returnBackTo;
    res.redirect ( redirectUrl) ;
}

module.exports.logout = (req, res, next) => {
    req.logout( function(err) {
        if(err) { return next(err); }
        req.flash('success', 'Successfully logged out!!!');
        res.redirect('/campgrounds');
    });
}