
import { Router } from 'express';
import * as userController from '../controllers/user_controller.js';
import { protect } from '../middleware/auth.js';
import { validateUser, validateLogin } from '../middleware/validation.js';

const routerUser = Router();

// Define your user routes here
// routerUser.post('/register', (req, res) => {
//   res.status(200).json(req.params);
// });

// Import data routes (no validation needed)
routerUser.post('/import/all', userController.importUsers);

// Auth routes with validation
routerUser.post('/login', validateLogin, userController.loginUser);
routerUser.post('/register', validateUser, userController.registerUser);

// Protected routes
routerUser.put('/', protect, userController.updateProfile);
routerUser.post('/delete', protect, userController.deleteUser);
routerUser.post('/update_password', protect, userController.changePassword);
routerUser.get('/profile', protect, userController.getUserProfile);

export default routerUser;

