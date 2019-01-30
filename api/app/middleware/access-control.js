import authenticate from './authenticate';
import Constants from '../config/constants';
const requestIp = require('request-ip');

export function accessControl(role) {
  if (!role) {
    throw new Error('Provide a role.');
  }

  const requiredRoleIndex = Constants.userRoles.indexOf(role);

  if (requiredRoleIndex < 0) {
    throw new Error('Not a valid role.');
  }

  return (req, res, next) => authenticate(req, res, (err) => {
    const currentRoleIndex = Constants.userRoles.indexOf(req.currentUser.role);
    if (
      err ||
      !req.currentUser ||
      currentRoleIndex < requiredRoleIndex
    ) {
      res.sendStatus(403);
      return;
    }

    next();
  });
}

export function accessControlByIP(IPAddress) {
  if (!IPAddress) {
    throw new Error('Provide an IP address.');
  }

  return (req, res, next) => {
    let IP = requestIp.getClientIp(req);

    if(IP !== IPAddress) {
      res.sendStatus(403);
      return;
    }

    next();
  };
}
