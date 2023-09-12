function isLoggedIn(req,res,next){
 if(req.user){
    next();
 }
 else{
    return res.status(401).render('401');
 }
}

module.exports= {isLoggedIn} ;