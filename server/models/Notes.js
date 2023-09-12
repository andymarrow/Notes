const mongoose =require('mongoose');
const Schema=mongoose.Schema;
const NoteSchema=new Schema({
    user:{//this helps to make not every one see one's notes
        //but only the user can see it
        type: Schema.ObjectId,
        ref:'user'
    }, 
    title:{
        type:String,
        required:true
    }, 
    body:{
        type:String,
        required:true
    }, 
    createdAt:{
        type: Date,
        default: Date.now()
    },
    updatedAt:{
        type: Date,
        default: Date.now()
    }
});

module.exports= mongoose.model('Note',NoteSchema);