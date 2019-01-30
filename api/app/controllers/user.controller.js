import BaseController from './base.controller';
import Constants from '../config/constants';
import User from '../models/user';

class UserController extends BaseController {

  whitelist = [
    'name',
    'email',
    'password',
    'role',
    'skype'
  ];

  sellers = async (req, res, next) => {
    try {
      return res.json(await User.find({role: 'seller'}));
    } catch(err) {
      return next(err);
    }
  }

  fetch = (req, res) => {
    const user = req.user || req.currentUser;

    if (!user) {
      const error = new Error('User could not be found');
      error.status = 404;
      return next(error);
    }

    res.json(user);
  }

  create = async (req, res, next) => {
    const params = this.filterParams(req.body, this.whitelist);

    let newUser = new User({
      ...params,
      provider: 'local',
    });

    try {
      const savedUser = await newUser.save();
      const token = savedUser.generateToken();

      // getting the stripped user information
      var currentUser = {
        id: savedUser.id,
        email: savedUser.email,
        name: savedUser.name.first + ' ' + savedUser.name.last
      };

      return res.status(201).json({ token: token, user: currentUser });
    } catch(error) {
      return next(error);
    }
  }

  update = async (req, res, next) => {
    const newAttributes = this.filterParams(req.body, this.whitelist);

    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      const error = new Error('Not a valid id');
      error.status = 400;
      return next(error);
    }

    const user = await User.findById(req.params.id);

    if(!user) {
      const error = new Error('User could not be found.');
      error.status = 404;
      return next(error);
    }
    /*
    if(newAttributes.password) {
      newAttributes.password = await User.hashPassword();
    }
    */

    try {
      await user.updateOne(newAttributes);
      res.status(200).json({ "status": "true"});
    } catch (error) {
      return next(error);
    }
  }

}

export default new UserController();
