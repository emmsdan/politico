import express from 'express';
import { urlencoded, json } from 'body-parser';
import jwtAuth from '../middleware/jwt-authenitcate';
import electionController from '../controller/electionController';
import authController from '../controller/authController';

const electionRouter = express.Router();
electionRouter.use(urlencoded({ extended: true }));
electionRouter.use(json());

/**
 * API: get all users
 * @access :GET /api/v1/users
 */
electionRouter.get('/users', jwtAuth.authentication, (req, res) => {
  authController.getUsers(req, res);
});

/**
 * API: file new petition
 * @access :POST /api/v1/petition
 */
electionRouter.post('/petition/', jwtAuth.authentication, (req, res) => {
  electionController.filePetition(req, res);
});

/**
 * API: get all filed petition
 * @access :GET /api/v1/petition
 */
electionRouter.get('/petition/', jwtAuth.authentication, (req, res) => {
  electionController.viewAllPetition(req, res);
});

/**
 * API: get specific filed petition
 * @access :GET /api/v1/petition/petitionid
 */
electionRouter.get('/petition/:petitionid', jwtAuth.authentication, (req, res) => {
  electionController.viewPetition(req, res);
});

/**
 * API: register a candidate for election
 * @access :GET /api/v1/office/<user-id>/register
 */
electionRouter.post('/office/:userID/register', jwtAuth.authentication, (req, res) => {
  electionController.registerCandidate(req, res);
});

/**
 * API: vote candidate
 * @access :POST /api/v1/vote/
 */
electionRouter.post('/vote', jwtAuth.authentication, (req, res) => {
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
