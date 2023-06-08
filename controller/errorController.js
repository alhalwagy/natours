const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleJsonWebTokenError = () =>
  new AppError('Invalid access. Please log in again !', 401);
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleTokenExpiredError = () =>
  new AppError('Your token has been expired. Please log in again!', 401);

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const meseage = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(meseage, 400);
};

const sendErrorDev = (err, req, res) => {
  //API
  //A)
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
    //Rendered website
  }
  //B)
  console.error('ERROR 💥', err);
  return res.status(err.statusCode).render('error', {
    title: 'Some thing went wrong',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  //API
  if (req.originalUrl.startsWith('/api')) {
    //opertional,trusted error : end back meseage to user
    //A)
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // B)
    //programing error or unknown error: don't send back error details
    //1) Log Error
    console.error('ERROR 💥', err);
    //2)send general message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
  //RENDERD
  //A)
  //opertional,trusted error : end back meseage to user
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Some thing went wrong',
      msg: err.message,
    });
  }
  //B)
  //programing error or unknown error: don't send back error details
  //1) Log Error
  console.error('ERROR 💥', err);
  //2)send general message
  return res.status(err.statusCode).render('error', {
    title: 'Some thing went wrong',
    msg: 'Please try again later.',
  });
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.create(err);
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJsonWebTokenError();
    if (error.name === 'TokenExpiredError') error = handleTokenExpiredError();

    sendErrorProd(error, req, res);
  }
};
