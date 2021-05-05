const express = require('express');
const app = express();
const ejs = require('ejs');
const { v4: uuid } = require('uuid');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const blogRoute = require('./routes/blog');
const session = require('express-session');
const flash = require('connect-flash');
const seed = require('./seed');
const PORT = process.env.PORT || 5000;

app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const sessionConfig = {
  secret: 'thisismysecret',
  resave: false,
  saveUninitialized: true,
};
app.use(session(sessionConfig));
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.use(blogRoute);

mongoose
  .connect('mongodb://localhost/blogApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('successfully connected to the database');
  })
  .catch((e) => console.log(e.message));

seed();

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
