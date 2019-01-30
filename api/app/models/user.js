import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Constants from '../config/constants';

const ROLES = Constants.userRoles;
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  name: {
    first: {
      type: String,
      required: [true, 'First name is required']
    },
    last: {
      type: String,
      required: [true, 'First name is required']
    }
  },
  role: {
    type: String,
    enum: ROLES,
    required: [true, 'Role is required'],
  },
  skype: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, 'Email is required'],
    validate: {
      validator(email) {
        // eslint-disable-next-line max-len
        const emailRegex = /^[-a-z0-9%S_+]+(\.[-a-z0-9%S_+]+)*@(?:[a-z0-9-]{1,63}\.){1,125}[a-z]{2,63}$/i;
        return emailRegex.test(email);
      },
      message: '{VALUE} is not a valid email.',
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
  },
}, {
  timestamps: true,
});

// Strip out password field when sending user object to client
UserSchema.set('toJSON', {
  virtuals: true,
  transform(doc, obj) {
    obj.id = obj._id;
    delete obj._id;
    delete obj.__v;
    delete obj.password;
    return obj;
  },
});

// Ensure email has not been taken
UserSchema
  .path('email')
  .validate(function(email) {
    return UserModel.findOne({ email })
      .then((user) => {
        return user ? false : true;
      })
      .catch(() => {
        return false;
      });
  }, 'Email already in use.');

// Validate password field
UserSchema
  .path('password')
  .validate(function(password) {
    return password.length >= 6 && password.match(/\d+/g);
  }, 'Password should be at least 6 characters long and contain 1 number.');

UserSchema
  .path('role')
  .validate(function(role) {
    return ROLES.indexOf(role) >= 0;
  }, 'Please select either "seller" or "admin" as the role for the new user');

//
UserSchema
  .pre('save', function(done) {
    // Encrypt password before saving the document
    if (this.isModified('password')) {
      const { saltRounds } = Constants.security;
      this.hashPassword(this.password, saltRounds, (err, hash) => {
        this.password = hash;
        done();
      });
    } else {
      done();
    }
    // eslint-enable no-invalid-this
  });

//
UserSchema
  .pre('updateOne', function(done) {
    if(this._update.password) {
      const { saltRounds } = Constants.security;
      // Encrypt password before saving the document
      this.schema.methods.hashPassword(this._update.password, saltRounds, (err, hash) => {
        this._update.password = hash;
        done();
      });
    }
    else {
      done();
    }
    // eslint-enable no-invalid-this
  });

/**
 * User Methods
 */
UserSchema.methods = {
  authenticate(password) {
    return bcrypt.compareSync(password, this.password);
  },

  generateToken() {
    return jwt.sign({ _id: this._id }, Constants.security.sessionSecret, {
      expiresIn: Constants.security.sessionExpiration,
    });
  },

  /**
   * Create password hash
   * @private
   * @param {String} password
   * @param {Number} saltRounds
   * @param {Function} callback
   * @return {Boolean} passwords match
   */
  hashPassword(password, saltRounds = Constants.security.saltRounds, callback) {
    return bcrypt.hash(password, saltRounds, callback);
  },
};

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
