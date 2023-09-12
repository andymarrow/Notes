 const Note=require('../models/Notes');
 const mongoose = require('mongoose');

 exports.dashboard = async (req, res) => {

    let perPage = 12;
    let page = req.query.page || 1;
  
    const locals = {
      title: "Dashboard",
      description: "Free NodeJS Notes App.",
    };
  
    try {
      // Mongoose "^7.0.0 Update
      const notes = await Note.aggregate([
        { $sort: { updatedAt: -1 } },
        { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
        {
          $project: {
            title: { $substr: ["$title", 0, 30] },
            body: { $substr: ["$body", 0, 100] },
          },
        },
      ])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
  
      const count = await Note.count();
  
      res.render('dashboard/index', {
        userName: req.user.firstName,
        locals,
        notes,
        layout: "../views/layouts/dashboard",
        current: page,
        pages: Math.ceil(count / perPage)
      });
     } catch (error) {
      console.log(error);
    }
  };

/*
get
when touched view specific note
*/

exports.dashboardViewNote= async(req,res)=>{
  const note=await Note.findById({_id: req.params.id})//in mongodb id is _id
  .where({user:req.user.id}).lean();

  if(note){
    res.render('../views/dashboard/view-notes',{
      noteID: req.params.id,
      note,
      layout: "../views/layouts/dashboard"
    });
  }
  else{
    res.Status("401").render(401);
  }


}

/*
put
update note when clicked
*/
exports.dashboardUpdateNote= async(req,res)=>{
  try {
    await Note.findOneAndUpdate(
      {_id: req.params.id},
      { title: req.body.title, body: req.body.body ,
        updatedAt:Date.now()
      
      }
      ).where({ user: req.user.id });//so that everbody cant access our database only the user can
      res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
    
  }
}

/*
delete
delete note when the confirming button on the alert sign is clicked
*/

exports.dashboardDeleteNote= async(req,res) =>{
  try {
    await Note.deleteOne(
      {_id: req.params.id}
    ).where({user : req.user.id});
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
  }


}

/*
get
when add note is clicked open the dashboard clone page
*/


exports.dashboardAddNote= async(req,res) =>{
  res.render('dashboard/add',{
    layout: '../views/layouts/dashboard'
  });


}

/*
post 
when the add note is clicked in the dashboard clone then add anew value to the data ase
*/

exports.dashboardAddNoteSubmit= async(req,res) =>{
  try {
    req.body.user= req.user.id;
    await Note.create(req.body);
    res.redirect('/dashboard');
  } catch (error) {
     console.log(error);
  }

}


/*
get
search
*/

exports.dashboardSearch=async(req,res)=>{
  try {
    res.render('dashboard/search',{
      searchResults: '',
      layout: '../views/layouts/dashboard'

    });
  } catch (error) {
      console.log(error);
  }

}

/*
post 
search for notes
*/

exports.dashboardSearchSubmit=async(req,res)=>{
  try {
    let searchTerm= req.body.searchTerm;
    const searchNoSpecialChars= searchTerm.replace(/[^a-zA-Z0-9]/g,"")//helps filter some bad characters
    const searchResults = await Note.find({
        $or:[
          { title: { $regex: new RegExp(searchNoSpecialChars,"i")}},
          { body: { $regex: new RegExp(searchNoSpecialChars,"i")}}
          
        ]
    }).where( {user : req.user.id} ); 
    res.render('dashboard/search',{
      searchResults,
      layout: '../views/layouts/dashboard'
    })

  } catch (error) {
    console.log(error); 
  }
}