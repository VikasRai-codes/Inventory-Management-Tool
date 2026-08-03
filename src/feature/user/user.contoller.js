import UserRepository from "./user.repository.js";

export default class userController{
    constructor(){
        this.userRepositer = new UserRepository();
    }

    async loginPage(req, res){
        try{
        res.render('login',{error: null,})
        }catch(err){
             return res.status().json(err); 
        }
        
    }

    async clearSession(req, res) {
        try{
            res.render('home',{
                userName: null
            })
        }catch(err){
             return res.status().json(err); 
        
        }
    }


    async signIn(req, res){
        // console.log(req.body);
        try{
              const user = await this.userRepositer.findByEmail(req.body.email)
              console.log(user)
            if(!user){
                res.status(404).render('login',{err: "invalid user"});
            } 
                req.session.userName = user.email;
            res.render('home', {
                userName: req.session.userName
            });
            
        }catch(err){
            res.status(parseInt(err.code)).send(err); 
        }  
    }
}