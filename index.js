const express = require('express');
const app = express();
const ejs = require('ejs');
const { v4: uuid } = require('uuid');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const blogRoute = require('./routes/blog');
const feed = require('./feed');
const PORT = process.env.PORT || 5000;

app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(blogRoute);

mongoose
  .connect('mongodb://localhost/blogApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('successfully connected to the database');
  })
  .catch((e) => console.log(e.message));

// feed();

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
