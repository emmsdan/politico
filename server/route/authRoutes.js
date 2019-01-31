import express from 'express';
import { urlencoded, json } from 'body-parser';
import jwtAuth from '../middleware/jwt-authenitcate';
import authController from '../controller/authController';

const authRouter = express.Router();
authRouter.use(urlencoded({ extended: true }));
authRouter.use(json());


/**
 * API: register new user
 * @access :POST /api/v1/auth/signup
 */
authRouter.post('/signup', jwtAuth.authenticationLoggedIn, (req, res) => {
  authController.register(req, res);
});

/**
 * API: get user reset link
 * @access :POST /api/v1/auth/reset
 */
authRouter.post('/reset', jwtAuth.authenticationLoggedIn, (req, res) => {
  authController.setPasswordLink(req, res);
});

export default authRouter;
