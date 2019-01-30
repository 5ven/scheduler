import * as chai from 'chai';
import server from '../utils/server.mock';
const expect = chai.expect;

import Schedule from '../../app/models/schedule';
import User from '../../app/models/user';
import UserFactory from '../factories/user.factory';

let masterScheduleCopy = {
  name: {
    first: 'James',
    last: 'Stewart'
  },
  ip: '192.168.14',
  seller: '', // will be set later
  email: 'james.stewart@gmail.com',
  startDate: '2019-07-24T19:53:25.578Z',
  startTime: '11:00'
};

let savedUser;
let savedSchedule;
let defaultSchedule;

describe('Model: Schedule', () => {
  before(done => {
    User.deleteMany({})
      .then(() => {
        Schedule.deleteMany({})
          .then(() => {
            return User.create(UserFactory.generate())
          })
          .then(user => {
            savedUser = user;
            masterScheduleCopy.seller = user.id;
            const schedule = new Schedule(masterScheduleCopy);
            return schedule.save();
          }).then((schedule) => {
            savedSchedule = schedule;
            done();
          });
      })
  });

  beforeEach(() => {
    defaultSchedule = Object.assign({}, masterScheduleCopy);
  });

  describe('#save', () => {
    it('requires a first name, last name, seller ID, email start date and time', () => {
      const schedule = new Schedule();
      const {errors} = schedule.validateSync();

      expect(errors.email).to.be.defined;
      expect(errors.password).to.be.defined;
      expect(errors.first).to.be.defined;
      expect(errors.last).to.be.defined;
      expect(errors.seller).to.be.defined;
      expect(errors.startDate).to.be.defined;
      expect(errors.startTime).to.be.defined;
    })
  });

  describe('#toJSON', () => {
    it('should remove __v, id, _id, updatedAt and createdAt', () => {
      const jsonSchedule = savedSchedule.toJSON();
      expect(savedSchedule.__v).to.exist;
      expect(jsonSchedule.__v).to.not.exist;
      expect(savedSchedule._id).to.exist;
      expect(jsonSchedule._id).to.not.exist;
      expect(savedSchedule.updatedAt).to.exist;
      expect(jsonSchedule.updatedAt).to.not.exist;
      expect(savedSchedule.createdAt).to.exist;
      expect(jsonSchedule.createdAt).to.not.exist;
    });
  });


});
