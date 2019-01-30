import { expect } from 'chai';
import server from '../../utils/server.mock';
import User from '../../../app/models/user';
import UserFactory from '../../factories/user.factory';

const ENDPOINT = '/user/sellers';

describe(`GET ${ENDPOINT}`, () => {
  before(() => {
    return User.deleteMany({})
      .then(() => User.create(UserFactory.generateList(5)))
  });

  describe('#200', () => {
    it('should return an array of sellers', done => {
      server.get(ENDPOINT)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.errors).to.be.undefined;
          expect(res.body).to.have.lengthOf(5);
          done();
        });
    });
  });

});
