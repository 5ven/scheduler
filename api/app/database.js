import mongoose from 'mongoose';
import Constants from './config/constants';

// Use native promises
mongoose.Promise = global.Promise;

// Connect to our mongo database;
mongoose.connect(Constants.mongo.uri,{ useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
mongoose.connection.on('error', (err) => {
  throw err;
});
