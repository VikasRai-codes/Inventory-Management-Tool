import express from 'express';
import userController from './user.contoller.js';

const userCtrl = new userController();

const userRoutes = express.Router();

// userRoutes.post('/signUp', (req, res)=>{
//     userCtrl.signUp(req, res);
// });

userRoutes.get('/', (req, res)=>{
    userCtrl.loginPage(req, res);
});

userRoutes.get('/logout',(req, res)=>{
    userCtrl.clearSession(req, res);
})
userRoutes.post('/', (req, res)=>{
    console.log("Post")
    userCtrl.signIn(req, res);
});


export default userRoutes;