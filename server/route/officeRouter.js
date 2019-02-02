import express from 'express';
import { urlencoded, json } from 'body-parser';
import jwtAuth from '../middleware/jwt-authenitcate';
import officeontroller from '../controller/officeController';

const officeRouter = express.Router();
officeRouter.use(urlencoded({ extended: true }));
officeRouter.use(json());

/**
 * API: create new government office
 * @access :POST /api/v1/offices
 */
officeRouter.post('/', jwtAuth.authentication, (req, res) => {
  officeontroller.create(req, res);
});

/**
 * API: Fetch a specific government office record
 * @access :GET /api/v1/offices/<office-id>
 */
officeRouter.get('/:officeID', jwtAuth.authentication, (req, res) => {
  officeontroller.get(req, res);
});

/**
 * API: Fetch all government offices records.
 * @access :GET /api/v1/offices/
 */
officeRouter.get('/', jwtAuth.authentication, (req, res) => {
  officeontroller.getAll(req, res);
});

export default officeRouter;
