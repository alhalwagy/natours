const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down....');
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require('./app');
// console.log(process.env);
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection successful !!');
  });

const port = process.env.PORT || 3000;
const sever = app.listen(port, () => {
  console.log(`App running on port ${port}.....`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLER REJECTION! 💥 Shutting down....');
  console.log(err.name, err.message);

  sever.close(() => {
    process.exit(1);
  });
});
