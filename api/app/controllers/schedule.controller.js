import BaseController from './base.controller';
import Constants from '../config/constants';
import Schedule from '../models/schedule';
import User from '../models/user';
const requestIp = require('request-ip');
import {errorHelper} from '../middleware/error-handler';
const pug = require('pug');
const moment = require('moment');

class ScheduleController extends BaseController {

  scheduleWhitelist = [
    'name',
    'email',
    'startDate',
    'startTime',
    'seller'
  ];

  upcoming = async (req, res, next) => {
    try {
      res.status(200).json({ "status": "true", "schedules": await Schedule.find({
        startDate: { $gt: Date.now() }
      }).select('startDate startTime') || [] })
    } catch(error) {
      error.status = 400;
      return next(error);
    }
  }

  delete = async (req, res, next) => {
    await Schedule.findOneAndDelete({_id: req.params.id}, (error, schedule) => {
      if (error) {
        const error = new Error(error.message);
        error.status = 400;
        return next(error);
      } else {
        if (!schedule) {
          const error = new Error('Schedule could not be found.');
          error.status = 404;
          return next(error);
        }
        else {
          return res.status(200).json({ "status": 'success'});
        }
      }
    })
  }

  create = async (req, res, next) => {
    let params = this.filterParams(req.body, this.scheduleWhitelist)
    params['ip'] = requestIp.getClientIp(req)

    let schedule = new Schedule({
      ...params,
      provider: 'local',
    });

    try {
      // getting the seller information and sending him/her the email
      let user = await User.findById(params['seller']);

      // someone might have inserted a wrong ID on purpose, or changed the
      // request parameter
      if (!user) {
        const error = new Error('Seller could not be found.');
        error.status = 404;
        return next(error);
      }
      else {
        const savedSchedule = await schedule.save();

        if(Constants.env === 'test') {
          return res.status(200).json({ "status": "success" });
        } else {
          const formattedDate = moment(savedSchedule.startDate)
            .format(Constants.dateFormat);
          const formattedTime = moment('1970-01-01 ' + savedSchedule.startTime)
            .format(Constants.timeFormat);

          mailgun.messages().send({
            from: process.env.FROM_EMAIL,
            to: [user.email],
            subject: process.env.EMAIL_TITLE,
            text: pug.renderFile(Constants.views + 'newScheduling-text.pug', {
              firstName: savedSchedule.name.first,
              lastName: savedSchedule.name.last,
              email: savedSchedule.email,
              startDate: formattedDate,
              startTime: formattedTime,
              companyName: process.env.COMPANY_NAME
            }),
            html: pug.renderFile(Constants.views + 'newScheduling.pug', {
              firstName: savedSchedule.name.first,
              lastName: savedSchedule.name.last,
              email: savedSchedule.email,
              startDate: formattedDate,
              startTime: formattedTime,
              companyName: process.env.COMPANY_NAME
            })
          }, (error, message) => {
            if (error) {
              return next(error);
            } else {
              return res.status(200).json({ "status": "success" });
            }
          });
        }
      }
    } catch (error) {
      error.status = 400;
      return next(error);
    }
  }

}

export default new ScheduleController();
