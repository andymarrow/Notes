async function homepage (req, res){
    const locals={
        title :'NodeJs Notes',
        description:'free NodeJs Notes'
    }
    res.render('index',{
        locals,
        layout:'../views/layouts/front-page'
    });
};
async function About (req, res){
    const locals={
        title :'About - NodeJs Notes',
        description:'free NodeJs Notes'
    }
    res.render('About',locals);
};



module.exports= {homepage,About};