import BaseController from './base.controller';
import User from '../models/user';

class AuthController extends BaseController {
  login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email: email });

      if (!user || !user.authenticate(password)) {
        const error = new Error('Please verify your credentials.');
        error.status = 401;
        return next(error);
      }

      // getting the stripped user information
      var currentUser = {
        email: user.email,
      };

      const token = user.generateToken();
      return res.status(200).json({ token: token, user: currentUser });
    } catch (error) {
      return next(error);
    }
  }
}

export default new AuthController();
