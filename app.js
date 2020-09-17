require('dotenv').config();
const express = require('express'),
      path = require('path'),
      logger = require('morgan'),
      createError = require('http-errors');

const dbConnection = require('./config/db')(process.env.MONGO_URI);

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// configure passport
const User = require('./models/user.model')(dbConnection);
const passport = require('./config/passport')(User.findOne.bind(User));
// initialize passport on every request
app.use(passport.initialize());

const Post = require('./models/post.model')(dbConnection);

const authController = require('./controllers/auth.controller')(User),
      postController = require('./controllers/post.controller')(Post);

const indexRouter = require('./routes/index'),
      authRouter = require('./routes/auth')(authController, passport),
      postRouter = require('./routes/post')(postController, passport);

app.use('/api', indexRouter);
app.use('/api', authRouter);
app.use('/api/post', postRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
  console.log(err)
  // set locals, only providing error in development
  const message = err.message;
  const error = req.app.get('env') === 'development' ? err : null;

  // render the error page
  res.status(err.status || 500).json({ message, error })
});

module.exports = app;
