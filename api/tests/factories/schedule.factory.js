import faker from 'faker';

class ScheduleFactory {

  generateList(count, attrs = {}) {
    let list = []
    let usedDates = []

    while(count) {
      let lastTime = '';
      let schedule = this.generate(attrs)
      if(!usedDates.includes(schedule.startDate)) {
        list.push(schedule);
        usedDates.push(schedule.startDate);
        count--;
      }
    }

    return list;
  }

  generate(attrs) {
    const newDate = new Date(faker.date.future());
    return Object.assign({}, {
      name: {
        first: faker.name.firstName(),
        last: faker.name.lastName()
      },
      email: faker.internet.email(),
      ip: faker.internet.ip(),
      seller: '',
      startDate: newDate.toISOString(),
      startTime: newDate.getHours() + ":" + newDate.getMinutes()
    }, attrs);
  }
}

export default new ScheduleFactory();
