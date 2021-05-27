const express=require("express");

const app=express();

const cookieParser=require("cookie-parser");

const mongoose=require("mongoose");
const cors=require("cors");
const Pusher=require("pusher");


const port=process.env.PORT || 8002;

const pusher = new Pusher({
    appId: "1210515",
    key: "659726a4064ecc3c5f9a",
    secret: "078461ef0e17b7bd9532",
    cluster: "ap2",
    useTLS: true
  });

app.use(cookieParser());
app.use(express.json());
app.use(cors());

const mongoURL="mongodb+srv://admin:FcfC1bRwBk1lHvcu@cluster0.y7fzx.mongodb.net/discordDB?retryWrites=true&w=majority"

mongoose.connect(mongoURL,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true
})

mongoose.connection.once('open',()=>{
    console.log("db is connected");

    const changeStream=mongoose.connection.collection('discords').watch();

    changeStream.on('change',(change)=>{
        console.log("change")
        if(change.operationType==='insert'){
            console.log("newChennel")
            pusher.trigger('channels','newChannel',{
                'change':change
            });
        }
        else if(change.operationType==='update'){
            console.log("mew message")
            pusher.trigger('messages','newMessage',{
                'change':change
            });
        }
      else {
            console.log("error triggering pusher")
        }
    })
})


// const User=require("./models/User")

// const userInput ={
//     username:"newUser",
//     password:"123456",
//     fullname:"hasrhdeep"
// }

// const user=new User(userInput);
// user.save((err,document)=>{
//     if(err)
//     console.log(err);

//     console.log(document);
// })

const userRouter=require('./routes/User.js');
app.use("/user",userRouter);

app.listen(port,()=>{
    console.log("server started")
})

