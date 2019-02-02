import express from 'express';
import { urlencoded, json } from 'body-parser';
import jwtAuth from '../middleware/jwt-authenitcate';
import partyController from '../controller/partyController';

const partyRouter = express.Router();
partyRouter.use(urlencoded({ extended: true }));
partyRouter.use(json());

/**
 * API: create new political party
 * @access :POST /api/v1/parties
 */
partyRouter.post('/', jwtAuth.authentication, (req, res) => {
  partyController.create(req, res);
});

/**
 * API: Edit the name of a specific political party.
 * @access :PATCH  /api/v1/parties/<party-id>/name
 */
partyRouter.patch('/:partyID/name', jwtAuth.authentication, (req, res) => {
  partyController.edit(req, res);
});

/**
 * API: Fetch a specific political party record
 * @access :GET /api/v1/parties/<party-id>
 */
partyRouter.get('/:partyID', jwtAuth.authentication, (req, res) => {
  partyController.get(req, res);
});

/**
 * API: Fetch all political parties records.
 * @access :GET /api/v1/parties/
 */
partyRouter.get('/', (req, res) => {
  partyController.getAll(req, res);
});

/**
 * API: Delete a specific political party.
 * @access :DELETE api/v1/parties/<party-id>
 */
partyRouter.delete('/:partyID', jwtAuth.authentication, (req, res) => {
  partyController.deleteParties(req, res);
});

export default partyRouter;
