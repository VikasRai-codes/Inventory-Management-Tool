import express from 'express';
import dashController from '../dashboard/dashboardContoller.js';

const dashRoutes = express.Router();

const dashCtrl = new dashController();

dashRoutes.get('/', (req, res)=>{
    dashCtrl.getDashboardData(req, res);
});

export default dashRoutes;