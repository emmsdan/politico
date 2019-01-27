import express from 'express';
import { urlencoded, json } from 'body-parser';
import officeontroller from '../controller/officeController';

const officeRouter = express.Router();
officeRouter.use(urlencoded({ extended: true }));
officeRouter.use(json());

const office = new officeontroller();
/**
 * API: create new government office
 * @access :POST /api/v1/parties
 */
officeRouter.post('/', (req, res) => {
  office.create(req, res);
});

export default officeRouter;
