import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { getProfile } from './middleware/getProfile';
import {sequelize} from "./model";

const app: Application = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

/**
 * FIX ME!
 * @returns contract by id
 */
app.get('/contracts/:id', getProfile, async (req: Request, res: Response) => {
    const { Contract } = req.app.get('models');
    const { id } = req.params;
    const contract = await Contract.findOne({ where: { id } });
    if (!contract) return res.status(404).end();
    res.json(contract);
});

export default app;