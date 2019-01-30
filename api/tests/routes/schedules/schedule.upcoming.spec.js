import { expect } from 'chai';
import server from '../../utils/server.mock';
import User from '../../../app/models/user';
import Schedule from '../../../app/models/schedule';
import UserFactory from '../../factories/user.factory';
import ScheduleFactory from '../../factories/schedule.factory';

const ENDPOINT = '/schedule/upcoming';
const AMOUNT_TO_GENERATE = 5;
let defaultAdminUserPayload;
let defaultUserPayload;
let defaultSchedulePayload;
let savedAdminUser;
let savedUser;
let schedules = ScheduleFactory.generateList(AMOUNT_TO_GENERATE);

describe(`GET ${ENDPOINT}`, () => {
  before(async function() {
    await Schedule.deleteMany({});
    await User.deleteMany({});

    defaultAdminUserPayload = await UserFactory.generateAdmin();
    defaultUserPayload = await UserFactory.generate();
    defaultSchedulePayload = await ScheduleFactory.generate();

    const adminUser = new User(defaultAdminUserPayload);
    await adminUser.save();
    savedAdminUser = adminUser;

    const user = new User(defaultUserPayload);
    await user.save();
    savedUser = user;

    for (const scheduleObject of schedules) {
      scheduleObject.seller = savedUser.id;
      await Schedule.create(scheduleObject);
    }
  });

  beforeEach(() => {
    defaultAdminUserPayload = UserFactory.generateAdmin();
    defaultUserPayload = UserFactory.generate();
    defaultSchedulePayload = ScheduleFactory.generate();
  });

  describe('#200', () => {
    it('should return an array of schedules', done => {
      server.get(ENDPOINT)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.errors).to.be.undefined;
          expect(res.body.schedules).to.have.lengthOf(AMOUNT_TO_GENERATE);
          done();
        });
    });
  });


});
