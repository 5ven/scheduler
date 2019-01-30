import { expect } from 'chai';
import server from '../../utils/server.mock';
import User from '../../../app/models/user';
import UserFactory from '../../factories/user.factory';

const ENDPOINT = '/user/';
let defaultUserPayload = UserFactory.generate();
let adminPayload = UserFactory.generateAdmin();
let savedUser;
let adminUser;

describe(`PUT ${ENDPOINT}:id`, () => {
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

  describe('#200', () => {
    it('should update a user when any of the fields has been changed', done => {
      server.put(ENDPOINT + savedUser.id)
        .set('authorization', adminUser.generateToken())
        .send({name: {first: 'Humphrey', last: 'Bogart'}, email: 'humphrey@bogart.com'})
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.errors).to.be.undefined;
          expect(res.body.status).to.equal('true');
          done();
        });
    });
  });

  describe('#400', () => {
    it('has invalid id', done => {
      server.put(ENDPOINT + 'this-is-invalid-id')
        .set('authorization', adminUser.generateToken())
        .send({email: 'humphrey@bogart.com'})
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.be.defined;
          expect(res.body.message).to.equal('Not a valid id');
          done();
        });
    });
  });

  describe('#404', () => {
    it('user could not be found', done => {
      server.put(ENDPOINT + '400000000000000000000001')
        .set('authorization', adminUser.generateToken())
        .send({email: 'humphrey@bogart.com'})
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.message).to.be.defined;
          expect(res.body.message).to.equal('User could not be found.');
          done();
        });
    });
  });

});
