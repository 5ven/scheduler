import { expect } from 'chai';
import server from '../../utils/server.mock';
import User from '../../../app/models/user';
import Schedule from '../../../app/models/schedule';
import UserFactory from '../../factories/user.factory';
import ScheduleFactory from '../../factories/schedule.factory';

const ENDPOINT = '/schedule/';
let defaultAdminUserPayload;
let defaultUserPayload;
let defaultSchedulePayload;
let savedAdminUser;
let savedUser;
let savedSchedule;

describe(`DELETE ${ENDPOINT}:id`, () => {
  before(async function() {
    await Schedule.deleteMany({});
    await User.deleteMany({});

    defaultUserPayload = await UserFactory.generate();
    defaultAdminUserPayload = await UserFactory.generateAdmin();
    defaultSchedulePayload = await ScheduleFactory.generate();

    const adminUser = new User(defaultAdminUserPayload);
    await adminUser.save();
    savedAdminUser = adminUser;

    const user = new User(defaultUserPayload);
    await user.save();
    savedUser = user;

    defaultSchedulePayload.seller = savedUser.id;
    const schedule = new Schedule(defaultSchedulePayload);
    await schedule.save();
    savedSchedule = schedule;
  });

  describe('#403', () => {
    it('a non-admin cannot delete', done => {
      server.delete(ENDPOINT + savedSchedule.id)
        .set('authorization', savedUser.generateToken())
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(err.response.error.text).to.equal('Forbidden');
          done();
        });
    });
  });

  describe('#404', () => {
    it('does not exist', done => {
      server.delete(ENDPOINT + '100000000000000000000001')
      .set('authorization', savedAdminUser.generateToken())
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to
        .equal('Schedule could not be found.');
        done();
      });

    });
  });

  describe('#200', () => {
    it('an admin can delete', done => {
      server.delete(ENDPOINT + savedSchedule.id)
        .set('authorization', savedAdminUser.generateToken())
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.equal('success');
          done();
        });
    });
  });

});
