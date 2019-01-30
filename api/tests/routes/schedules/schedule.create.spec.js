import { expect } from 'chai';
import server from '../../utils/server.mock';
import User from '../../../app/models/user';
import Schedule from '../../../app/models/schedule';
import UserFactory from '../../factories/user.factory';
import ScheduleFactory from '../../factories/schedule.factory';

const ENDPOINT = '/schedule';
let defaultUserPayload = UserFactory.generate();
let defaultSchedulePayload = ScheduleFactory.generate();
let savedUser;

describe(`POST ${ENDPOINT}`, () => {
  before(async function() {
    await Schedule.deleteMany({});
    await User.deleteMany({});
    const user = new User(defaultUserPayload);
    await user.save();
    savedUser = user
  });

  beforeEach(() => {
    defaultUserPayload = UserFactory.generate();
    defaultSchedulePayload = ScheduleFactory.generate();
  });

  describe('#404', () => {
    it('seller not found', done => {
      defaultSchedulePayload.seller = '100000000000000000000001';

      server.post(ENDPOINT)
      .send(defaultSchedulePayload)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.defined;
        expect(res.body.message).to.equal('Seller could not be found.');
        done();
      })
  });

  describe('#200', () => {
    it('schedule was saved', done => {
      defaultSchedulePayload.seller = savedUser._id;
      server.post(ENDPOINT)
      .send(defaultSchedulePayload)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.defined;
        expect(res.body.status).to.equal('success');
        done();
      })
    });
  });

  });
});
