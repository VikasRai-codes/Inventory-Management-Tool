import express from "express";
import ejsLayouts from "express-ejs-layouts";
import path from "path";
import session from "express-session";

import { connectToSql } from "./src/config/db.js";
import { startServer } from "./src/config/kafka.js";
import { ApplicationError } from './src/errorHandling/applicationErrorHandling.js';

//import API routes
import userRoutes from "./src/feature/user/user.routes.js";
import productRoutes from "./src/feature/product/product.routes.js";
import purchaseRoutes from "./src/feature/purchase/purchaseRoutes.js";
import salesRoutes from "./src/feature/sale/salesRoutes.js";
import transactionsRoutes from "./src/feature/transaction/transactionsRoutes.js";
import dashRoutes from "./src/feature/dashboard/dashboardRoutes.js";
import homepage from "./src/feature/home/homePageController.js";
import { auth } from "./src/feature/middleware/auth.js";

const app = express();

// set public and views folder to publicly accesss.
app.use(express.static('src/public'));
app.use(express.static('src/views'));
app.use(ejsLayouts);
app.set(
    "layout",
    "layout"
);

// set views files
app.set('view engine', 'ejs');
app.set('views', path.join(path.resolve(),'src','views' ));

app.use(express.json());
app.use(express.urlencoded({ extended:true }))
app.use(
    session({
        secret: 'SecretKey',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
    })
)

app.get('/', homepage);
//Rest API for all CRUD oprerations
app.use('/api/login', userRoutes);
app.use('/api/dashboard',auth, dashRoutes);
app.use('/api/products',auth, productRoutes);
app.use('/api/purchase', auth, purchaseRoutes);
app.use('/api/sales', auth, salesRoutes);
app.use('/api/transactions',auth, transactionsRoutes)

app.use((err, req, res, next)=>{
    console.log(err);
    if(err instanceof ApplicationError){
        res.status(err.code).send(err.message)
    }
    res.status(500).send('Somthing went wrong pls try again');
});

app.listen(3000, ()=>{
    console.log(`server start listening on port ${3000}...`);
    connectToSql();
    startServer();
});
