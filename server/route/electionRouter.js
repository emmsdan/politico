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
 * API: register a candidate for election
 * @access :GET /api/v1/office/<user-id>/register
 */
electionRouter.post('/office/:userID/register', (req, res) => {
  electionController.registerCandidate(req, res);
});

/**
 * API: vote candidate
 * @access :GET /api/v1/offices/
 */
electionRouter.post('/vote', (req, res) => {
  electionController.vote(req, res);
});

export default electionRouter;
