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
 * @access :POST /api/v1/vote/
 */
electionRouter.post('/vote', (req, res) => {
  electionController.vote(req, res);
});

/**
 * API: view all candidate
 * @access :GET /api/v1/candidate
 */
electionRouter.get('/candidate', (req, res) => {
  electionController.getCandidates(req, res);
});

/**
 * API: view all election results
 * @access :GET /api/v1/office/result
 */
electionRouter.get('/office/result', (req, res) => {
  electionController.getElectionResult(req, res);
});

/**
 * API: view election results of an office
 * @access :GET /api/v1/office/<office-id>/result
 */
electionRouter.get('/office/:officeId/result', (req, res) => {
  electionController.getOfficeResult(req, res);
});
export default electionRouter;
