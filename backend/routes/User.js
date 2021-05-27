const express = require("express");
const userRouter=express.Router();
const passport=require('passport');

const passportConfig=require("../passport.js")
const JWT=require("jsonwebtoken");
const User=require('../models/User.js')

const Discord =require('../models/Channel');
const { use } = require("passport");
const signToken=userID=>{
    return JWT.sign({
        iss:"noobCoder",
        sub: userID
    },"noobCoder",{expiresIn:"1h"});
}


userRouter.post("/register",(req,res)=>{
    console.log("hello")
    console.log(req.body.username)
    const {username,fullname,password}=req.body;

    User.findOne({username},(err,user)=>{
        if(err)
           res.status(500).json({message:{msgBody:"Error has occored",msgerror:true}})

        if(user)
        res.status(400).json({message:{msgBody:"USername already taken",msgerror:true}})

        else {
            const newUser=new User({username,fullname,password})

            newUser.save(err=>{
                if(err)
                res.status(500).json({message:{msgBody:"errror occured",msgerror:true}})

                else res.status(201).json({message:{msgBody:"Account created",msgerror:false}})
                  
            })
        }
    })
})

userRouter.post("/login",passport.authenticate('local',{session:false}),(req,res)=>{
    console.log("login success")
    if(req.isAuthenticated()){
       
        const {_id,username,fullname}=req.user;
        const token=signToken(_id);
        // console.log(token)
        res.cookie('access_token',token,{httpOnly:true});

        res.status(200).json({isAuthenticated:true,user:{username,fullname}})
    }

})

userRouter.get("/logout",passport.authenticate('jwt',{session:false}),(req,res)=>{
    console.log("hellleo")
    res.clearCookie('access_token');
   res.send({user:{username:"",fullname:""},success:true})

});

//to sync server and react to prevent logging out on refreshing
    userRouter.get("/authenticated",passport.authenticate('jwt',{session:false}),(req,res)=>{
        console.log(req)
    const {username,fullname}=req.user;
    res.status(200).json({isAuthenticated:true,user:{username,fullname}});

           });

    userRouter.post('/newChannel',(req,res)=>{
        const data=req.body;
        Discord.create(data,(err,data)=>{
            if(err)
            res.status(500).send(err)
            else
            res.status(201).send(data);
        })
    })

    userRouter.get('/channelList',(req,res)=>{
         Discord.find({},(err,data)=>{
             if(err)
             res.status(500).send(err);
             else 
             res.status(200).send(data);
         })
    })
    
    userRouter.post('/newMessage',(req,res)=>{
        console.log("oin server")
        const message=req.body;
          Discord.updateOne({_id:req.query.id},{$push:{conversations:req.body}},(err,data)=>{
           
            if(err)
             res.status(500).send(err);
             else 
             res.status(200).send(data);
          })
    })

    userRouter.get('/getMessages',(req,res)=>{
        // console.log("hello")
        // console.log(req.query.id)
        Discord.find({_id:req.query.id},(err,data)=>{
            if(err)
            res.status(500).send(err);
            else {
                // console.log(data)
                res.status(200).send(data);
            }
            
        })
    })


module.exports=userRouter;