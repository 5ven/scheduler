import mongoose from 'mongoose';
import Constants from '../config/constants';
var uniqueValidator = require('mongoose-unique-validator');
require('mongoose-type-email');

const ScheduleSchema = new mongoose.Schema({
  name: {
    first: {
      type: String,
      required: [true, 'First Name is required']
    },
    last: {
      type: String,
      required: [true, 'Last Name is required']
    }
  },
  ip: {
    type: String,
    required: false,
    unique: [Constants.useUniqueIPs, 'IP address already exists']
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  email: {
    type:  mongoose.SchemaTypes.Email,
    required: [true, 'Email is required']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required'],
  }}, {
  timestamps: true,
});

ScheduleSchema.plugin(uniqueValidator, { message: '{PATH} already exists' });

ScheduleSchema.pre('save', function (next) {
  ScheduleModel.findOne({ startTime: this.startTime, startDate: Date.parse(this.startDate) }).then((scheduleItem) => {
    if(scheduleItem) {
      let validationError = new mongoose.Error.ValidationError(null);
      validationError.addError('startTime', new mongoose.Error.ValidatorError({
        type: 'alreadyUsed',
        message: 'A meeting has already been scheduled for that date and time!'
      }));
      next(validationError);
    }
    else {
      next();
    }
  })
  .catch((error) => {
    next(new Error(error))
  });
});

// Strip out certain fields when sending the object to client
ScheduleSchema.set('toJSON', {
  virtuals: true,
  transform(doc, obj) {
    delete obj.id;
    delete obj.__v;
    delete obj.updatedAt;
    delete obj.createdAt;
    delete obj._id;
    return obj;
  },
});

const ScheduleModel = mongoose.model('Schedule', ScheduleSchema);

export default ScheduleModel;
