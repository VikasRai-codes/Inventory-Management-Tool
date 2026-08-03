function homepage(req, res){
    return res.render('home',{
        userName: null,
        userName: req.session.userName
    });
}

export default homepage;