const mongoose=require('mongoose');
mongoose.connect('mongodb+srv://nishant:nishant.1234@cluster0.aywgg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
{
    useNewUrlParser:true,
    useUnifiedTopology:true,
});

const db=mongoose.connection;
db.on('error',console.error.bind(console,'error in connecting to Mongodb'));

db.once('open',function(){
    console.log('Connected to Database:: Mongodb');
});
module.exports=db;