import express from 'express';
import productController from "./product.controller.js";

const productCtrl = new productController();

const productRoutes = express.Router();

productRoutes.post('/', (req, res, next)=>{
    productCtrl.addProduct(req, res);
}); 

export default productRoutes;