if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
};

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoStore = require('connect-mongo');
const app = express();


const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Mongo Atlas database connected...');
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const secret = process.env.SECRET;

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret: secret,
  },
});

store.on('error', function(e) {
  console.log('SESSION STORE ERROR!', e);
});

const sessionConfig = {
  store: store,
  name: 'session',
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use(mongoSanitize());
app.use(helmet());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// ! ***********************************************************************
const scriptSrcUrls = [
  'https://stackpath.bootstrapcdn.com/',
  'https://api.tiles.mapbox.com/',
  'https://api.mapbox.com/',
  'https://kit.fontawesome.com/',
  'https://cdnjs.cloudflare.com/',
  'https://cdn.jsdelivr.net/',
  'https://res.cloudinary.com/dv5vm4sqh/',
];
const styleSrcUrls = [
  'https://cdnjs.cloudflare.com/',
  'https://kit-free.fontawesome.com/',
  'https://stackpath.bootstrapcdn.com/',
  'https://api.mapbox.com/',
  'https://api.tiles.mapbox.com/',
  'https://fonts.googleapis.com/',
  'https://use.fontawesome.com/',
  'https://cdn.jsdelivr.net/',
  'https://res.cloudinary.com/dv5vm4sqh/',
];
const connectSrcUrls = [
  'https://*.tiles.mapbox.com',
  'https://api.mapbox.com',
  'https://events.mapbox.com',
  'https://res.cloudinary.com/dv5vm4sqh/',
];
const fontSrcUrls = [
  'https://res.cloudinary.com/dv5vm4sqh/',
  'https://cdnjs.cloudflare.com',
];

app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: [],
        connectSrc: ['\'self\'', ...connectSrcUrls],
        scriptSrc: ['\'unsafe-inline\'', '\'self\'', ...scriptSrcUrls],
        styleSrc: ['\'self\'', '\'unsafe-inline\'', ...styleSrcUrls],
        workerSrc: ['\'self\'', 'blob:'],
        objectSrc: [],
        imgSrc: [
          '\'self\'',
          'blob:',
          'data:',
          'https://res.cloudinary.com/dthjvj2og/',
          'https://images.unsplash.com/',
        ],
        fontSrc: ['\'self\'', ...fontSrcUrls],
        mediaSrc: ['https://res.cloudinary.com/dv5vm4sqh/'],
        childSrc: ['blob:'],
      },
    }),
);
// ! ***********************************************************************

app.use((req, res, next) => {
  // console.log(req.session);
  // console.log(req.redirectUrl);
  // console.log(req.query);
  res.locals.currentUser = req.user;
  res.locals.redirectUrl = req.session.returnTo; // Temp solution per comments on video 519.
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

app.get('/', (req, res) => {
  res.render('home');
});

// ERROR HANDLERS ***************************************************
app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
  const {statusCode = 500} = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!';
  res.status(statusCode).render('error', {err});
});
// ERROR HANDLERS ***************************************************

app.listen(3000, () => {
  console.log('SERVING VIA RENDER');
});
