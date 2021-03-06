import * as chai from 'chai';
import server from '../../utils/server.mock';
import User from '../../../app/models/user';
import UserFactory from '../../factories/user.factory';

const expect = chai.expect;

const ENDPOINT = '/auth/login'
let defaultUserPayload = UserFactory.generate();
let savedUser;

describe(`POST ${ENDPOINT}`, () => {
  before(() => {
    return User.deleteMany({})
      .then(() => User.create(defaultUserPayload))
      .then(u => savedUser = u);
  });

  describe('#200', () => {
    it('return an auth token upon successful password verification', () => {
      return server.post(ENDPOINT)
        .send({email: savedUser.email, password: defaultUserPayload.password})
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body.token).to.be.defined;
        });
    });
  });

  describe('#401', () => {
    it('correct email, incorrect password', done => {
      server.post(ENDPOINT)
        .send({email: savedUser.email, password: 'wrong'})
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.equal('Please verify your credentials.')
          done();
        });
    });

    it('incorrect email, incorrect password', done => {
      server.post(ENDPOINT)
        .send({email: 'wrong', password: 'wrong'})
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.equal('Please verify your credentials.')
          done();
        });
    });
  })
});
