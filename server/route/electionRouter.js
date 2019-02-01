import express from 'express';
import { urlencoded, json } from 'body-parser';
import jwtAuth from '../middleware/jwt-authenitcate';
import electionController from '../controller/electionController';

const electionRouter = express.Router();
electionRouter.use(urlencoded({ extended: true }));
electionRouter.use(json());

/**
 * API: file new petition
 * @access :POST /api/v1/petition
 */
electionRouter.post('/petition/', /* jwtAuth.authenticationLoggedIn, */ (req, res) => {
  electionController.filePetition(req, res);
});

/**
 * API: Fetch a specific government office record
 * @access :GET /api/v1/offices/<office-id>
 */
electionRouter.get('/:officeID', (req, res) => {
  electionController.get(req, res);
});

/**
 * API: Fetch all government offices records.
 * @access :GET /api/v1/offices/
 */
electionRouter.get('/', (req, res) => {
  electionController.getAll(req, res);
});

export default electionRouter;
