import express from 'express';
import purchaseController from './purchase.controller.js';

const purchaseCtrl = new purchaseController();

const purchaseRoutes = express.Router();

purchaseRoutes.post('/add', (req, res)=>{
    purchaseCtrl.addPurchase(req, res);
}); 

purchaseRoutes.get('/', (req, res)=>{
    purchaseCtrl.getPurchasePage(req, res);
});


export default purchaseRoutes;