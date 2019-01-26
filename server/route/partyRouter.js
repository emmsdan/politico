import express from 'express';
import { urlencoded, json } from 'body-parser';
import partyController from '../controller/partyController';

const partyRouter = express.Router();

const party = new partyController();
/**
 * API: create new political party
 * @access :POST /api/v1/parties
 */
partyRouter.post('/', (req, res) => {
  party.create(req, res);
});

export default partyRouter;
