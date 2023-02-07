/* eslint-disable max-len */
const User = require('../models/user');


module.exports.renderRegister = (req, res) => {
  res.render('users/register');
};

module.exports.register = async (req, res, next) => {
  try {
    const {email, username, password} = req.body;
    const user = new User({email, username});
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash('success', 'Welcome to Yelp Camp!');
      res.redirect('/campgrounds');
    });
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('register');
  }
};

module.exports.renderLogin = (req, res) => {
  res.render('users/login');
};

module.exports.login = (req, res) => {
  const {username} = req.user;
  req.flash('success', `Welcome back, ${username}!`);
  const redirectUrl = res.locals.redirectUrl || '/campgrounds'; // Temp solution (res.locals.redirectUrl) per comments from Rahul on video 519.
  delete res.locals.redirectUrl; // Temp solution (delete res.locals.redirectUrl) per comments from Rahul on video 519.
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  const {username} = req.user;
  req.logout((err) => {
    if (err) return next(err);
    req.flash('success', `Goodbye, ${username}!`);
    res.redirect('/campgrounds');
  });
};
