import faker from 'faker';

class UserFactory {
  generateList(count, attrs = {}) {
    let list = []
    while(count) {
      list.push(this.generate(attrs));
      count--;
    }
    return list;
  }

  generateAdmin (attrs) {
    return Object.assign({}, {
      name: {
        first: 'James',
        last: 'Dean'
      },
      email: 'jamesdean@gmail.com',
      password: 'password1',
      role: 'admin'
    }, attrs);
  }

  generate(attrs) {
    return Object.assign({}, {
      name: {
        first: faker.name.firstName(),
        last: faker.name.lastName(),
      },
      email: faker.internet.email(),
      password: 'password1',
      role: 'seller'
    }, attrs);
  }
}

export default new UserFactory();
