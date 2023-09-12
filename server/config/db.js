const mongoose = require('mongoose');
mongoose.set('strictQuery',false);//this is to decrease some of the warnings seen in the terminal
const connectDB= async()=>{
try {
    const conn=await mongoose.connect(process.env.MONGODB_URI);
    console.log(`mongoose connected ${conn.connection.host}`);
} catch (error) {
    console.log(error);
    
}
}

module.exports= connectDB;