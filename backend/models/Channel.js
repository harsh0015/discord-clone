const mongoose =require("mongoose");

const disCordSchema=mongoose.Schema({
    channelName:String,
    conversations:[
        {
            message:String,
            timestamp:String,
            user:{
                username:String,
                fullname:String,
            }
        }
    ]
})

module.exports=mongoose.model("Discord",disCordSchema);