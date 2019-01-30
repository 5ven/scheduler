import { expect } from 'chai';
import server from '../../utils/server.mock';
import User from '../../../app/models/user';
import UserFactory from '../../factories/user.factory';

const ENDPOINT = '/user';
let defaultUserPayload = UserFactory.generate();
let adminPayload = UserFactory.generateAdmin();
let savedUser;
let adminUser;

describe(`POST ${ENDPOINT}`, () => {
  before(() => {
    return User.deleteMany({})
      .then(() => User.create(adminPayload))
      .then((u) => adminUser = u)
      .then(() => User.create(defaultUserPayload))
      .then(u => savedUser = u)
  });

  beforeEach(() => {
    defaultUserPayload = UserFactory.generate();
    adminPayload = UserFactory.generateAdmin();
  });

  describe('#500', () => {
    it('requires unique email', done => {
      server.post(ENDPOINT)
        .set('authorization', adminUser.generateToken())
        .send(savedUser.toJSON())
        .end((err, res) => {
           expect(res).to.have.status(500);
           expect(res.body.errors).to.be.defined;
           expect(res.body.errors.email).to.equal('Email already in use.');
           done();
        });
    });

    it('requires a password', done => {
      delete defaultUserPayload.password;
      server.post(ENDPOINT)
        .set('authorization', adminUser.generateToken())
        .send(defaultUserPayload)
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body.errors).to.be.defined;
          expect(res.body.errors.password).to.equal('Password is required.');
          done();
        });
    });

    it('requires a strong password', done => {
      server.post(ENDPOINT)
        .set('authorization', adminUser.generateToken())
        .send(UserFactory.generate({password: 'short'}))
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body.errors).to.be.defined;
          expect(res.body.errors.password).to.equal('Password should be at least 6 characters long and contain 1 number.');
          done();
        });
    });
  });

});
