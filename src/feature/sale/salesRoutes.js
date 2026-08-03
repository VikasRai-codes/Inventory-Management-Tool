import express from 'express';
import salesController from './salesController.js';

const salesRoutes = express.Router();
const salesCtrl = new salesController();

salesRoutes.get('/', (req, res)=>{
    salesCtrl.renderSalePage(req, res);
})

salesRoutes.post('/', (req, res)=>{
    console.log(" post/appi/sale/add")
    salesCtrl.addSales(req, res);
})

export default salesRoutes;