import express from 'express';
import transactionsController from './transactionsController.js';

const transCtrl = new transactionsController();

const transactionsRoutes = express.Router();

transactionsRoutes.get('/', (req, res, next)=>{
    transCtrl.getTransections(req, res);
});


export default transactionsRoutes;