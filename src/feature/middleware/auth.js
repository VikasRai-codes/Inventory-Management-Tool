export const auth = (req, res, next) => {
    if(req.session.userName){
        next();
    }else{
        res.render('dashboard')
    }
}