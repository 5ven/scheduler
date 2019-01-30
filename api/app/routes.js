import { Router } from 'express';

import MetaController from './controllers/meta.controller';
import AuthController from './controllers/auth.controller';
import ScheduleController from './controllers/schedule.controller';
import UserController from './controllers/user.controller';

// Handling middleware
import authenticate from './middleware/authenticate';
import {accessControlByIP, accessControl} from './middleware/access-control';
import errorHandler from './middleware/error-handler';

const routes = new Router();

routes.get('/', MetaController.index);

// Authentication
routes.post('/auth/login', AuthController.login);

// Schedule
routes.post('/schedule', ScheduleController.create);
routes.get('/schedule/upcoming', ScheduleController.upcoming);
routes.delete('/schedule/:id', accessControl('admin'), ScheduleController.delete);

// User
routes.post('/user', accessControl('admin'), UserController.create);
routes.put('/user/:id', accessControl('admin'), UserController.update);
routes.get('/user/sellers', UserController.sellers);
routes.get('/user/me', accessControl('seller'), UserController.fetch);

routes.use(errorHandler);

export default routes;
